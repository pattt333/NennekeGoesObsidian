#!/usr/bin/env python3
"""Inventory, convert, validate, and publish the Nenneke V2 LaTeX archive.

The archive remains the immutable input. Generated Markdown first goes to a
staging directory; ``apply`` copies only source-mapped files into the vault.
"""

from __future__ import annotations

import argparse
import html
import hashlib
import json
import posixpath
import re
import shutil
import sys
import zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "NennekeV2.zip"
REPORTS = ROOT / "conversion" / "nenneke-v2"
STAGING = ROOT / "build" / "nenneke-v2" / "vault"
VAULT = ROOT / "vault"
DESIGN_PRINCIPLES = ROOT / "content" / "design-principles"
PUBLICATION_OUTPUT = ROOT / "output" / "pdf" / "NennekeV2.pdf"
ROOT_TEX = {"main.tex", "Abstract.tex", "Acknowledgements.tex", "Notations_and_Symbols.tex"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".svg"}
INCLUDE_RE = re.compile(r"^\s*\\(?:input|include)\{([^}]+)\}", re.MULTILINE)
COMMENTED_INCLUDE_RE = re.compile(r"^\s*%\s*\\(?:input|include)\{([^}]+)\}", re.MULTILINE)
LABEL_RE = re.compile(r"\\label\{([^}]+)\}")
COMMAND_RE = re.compile(r"\\([A-Za-z@]+)\*?")
MARKDOWN_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
CHAPTER_TITLES = {
    "Chapters/01_Proben.tex": "Proben",
    "Chapters/02_Charaktere.tex": "Charaktere",
    "Chapters/03_Eigenschaften.tex": "Eigenschaften",
    "Chapters/04_Fertigkeiten/04_Fertigkeiten.tex": "Fertigkeiten",
    "Chapters/05_Gesundheit.tex": "Gesundheit",
    "Chapters/06_kampf/06_Kampf.tex": "Kampf",
    "Chapters/07_vorteile/07_Vorteile.tex": "Vorteile",
    "Chapters/08_rast/08_Rast.tex": "Rast und Herstellung",
    "Chapters/09_Super_Skill/09_Super_Skill.tex": "Übernatürliche Fähigkeiten",
}
TABLE_LOOKUP_SOURCES = (
    "Chapters/01_Proben.tex",
    "Chapters/04_Fertigkeiten/04_Fertigkeiten.tex",
    "Chapters/05_Gesundheit.tex",
    "Chapters/06_kampf/06_Kampf.tex",
    "Chapters/07_vorteile/07_Vorteile.tex",
    "Chapters/09_Super_Skill/09_Super_Skill.tex",
)
RULE_INDEX = "regelindex.md"
RULE_DESIGN = "grundideen-des-regeldesigns.md"
CHAPTER_DESIGN_SOURCES = {
    "Chapters/01_Proben.tex": "01_proben.md",
    "Chapters/03_Eigenschaften.tex": "03_eigenschaften.md",
    "Chapters/04_Fertigkeiten/04_Fertigkeiten.tex": "04_fertigkeiten.md",
    "Chapters/05_Gesundheit.tex": "05_gesundheit.md",
    "Chapters/06_kampf/06_Kampf.tex": "06_kampf.md",
    "Chapters/07_vorteile/07_Vorteile.tex": "07_vorteile.md",
    "Chapters/08_rast/08_Rast.tex": "08_rast-und-talente.md",
    "Chapters/09_Super_Skill/09_Super_Skill.tex": "09_uebernatuerliche-faehigkeiten.md",
}


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def design_principles(source: str) -> str:
    """Return the editorial chapter principles supplied outside the ZIP archive."""
    filename = CHAPTER_DESIGN_SOURCES.get(source)
    if not filename:
        return ""
    return (DESIGN_PRINCIPLES / filename).read_text(encoding="utf-8").strip()


def insert_after_h1(content: str, addition: str) -> str:
    """Insert editorial content immediately after the note's first H1."""
    if not addition:
        return content
    lines = content.splitlines()
    for index, line in enumerate(lines):
        if line.startswith("# "):
            return "\n".join([*lines[: index + 1], "", addition, "", *lines[index + 1 :]])
    raise ValueError("Generated chapter is missing its H1 heading.")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def strip_comments(text: str) -> str:
    return re.sub(r"(?<!\\)%.*$", "", text, flags=re.MULTILINE)


def normalise_tex_path(value: str, parent: str = "") -> str:
    value = value.strip().replace("\\", "/")
    if not value.endswith(".tex"):
        value += ".tex"
    if value.startswith("Chapters/") or "/" in value:
        return value
    return str(Path(parent).parent / value).replace("\\", "/")


def destination(source: str) -> str | None:
    if source == "Sammanfattning.tex":
        return "rules/Sammanfattning.md"
    if source.startswith("Chapters/") and source.endswith(".tex"):
        return "rules/" + source[len("Chapters/") : -4] + ".md"
    return None


def anchor(label: str) -> str:
    label = label.lower().replace("_", "-")
    label = re.sub(r"[^a-z0-9äöüß-]+", "-", label)
    return re.sub(r"-+", "-", label).strip("-") or "section"


def title_for(source: str) -> str:
    return CHAPTER_TITLES.get(source, Path(source).stem.replace("_", " "))


def relative_link(current: str, target: str) -> str:
    return posixpath.relpath(target, start=posixpath.dirname(current) or ".")


def navigation_graph(archive: "Archive", source_map: dict[str, str]) -> tuple[dict[str, list[str]], dict[str, str]]:
    """Return mapped include children and the first mapped parent for each source."""
    children: dict[str, list[str]] = {}
    parents: dict[str, str] = {}
    for parent in ["main.tex", *source_map]:
        mapped_children = [child for child in archive.includes(parent) if child in source_map]
        children[parent] = mapped_children
        for child in mapped_children:
            parents.setdefault(child, parent)
    return children, parents


def link_to(current: str, target: str, title: str) -> str:
    return f"[{title}]({relative_link(current, target)})"


def note_navigation(source: str, source_map: dict[str, str], children: dict[str, list[str]], parents: dict[str, str]) -> str:
    """Render compact navigation for a source note from the include graph."""
    parent = parents.get(source)
    if not parent:
        return ""
    current = source_map[source]
    siblings = children.get(parent, [])
    position = siblings.index(source)
    links: list[str] = []
    if position:
        previous = siblings[position - 1]
        links.append("← " + link_to(current, source_map[previous], title_for(previous)))
    parent_target = "index.md" if parent == "main.tex" else source_map[parent]
    parent_title = "Startseite" if parent == "main.tex" else title_for(parent)
    links.append("↑ " + link_to(current, parent_target, parent_title))
    if position + 1 < len(siblings):
        following = siblings[position + 1]
        links.append(link_to(current, source_map[following], title_for(following)) + " →")
    return "\n\n---\n\n**Regelbuchnavigation:** " + " · ".join(links) + "\n"


class Archive:
    def __init__(self, archive_path: Path = ARCHIVE) -> None:
        if not archive_path.is_file():
            raise FileNotFoundError(f"Authoritative archive not found: {archive_path}")
        self.path = archive_path
        self.zip = zipfile.ZipFile(archive_path)
        self.entries = {entry.filename: entry for entry in self.zip.infolist() if not entry.is_dir()}
        self.text: dict[str, str] = {
            name: self.zip.read(name).decode("utf-8", errors="replace")
            for name in self.entries
            if name.endswith(".tex")
        }

    def close(self) -> None:
        self.zip.close()

    def includes(self, source: str, commented: bool = False) -> list[str]:
        pattern = COMMENTED_INCLUDE_RE if commented else INCLUDE_RE
        return [normalise_tex_path(match.group(1), source) for match in pattern.finditer(self.text.get(source, ""))]

    def converted_sources(self) -> list[str]:
        return sorted(name for name, entry in self.entries.items() if entry.file_size and destination(name))

    def include_tree(self, source: str = "main.tex", seen: set[str] | None = None) -> list[str]:
        seen = seen or set()
        ordered: list[str] = []
        for child in self.includes(source):
            if child in seen or child not in self.text:
                continue
            seen.add(child)
            ordered.append(child)
            ordered.extend(self.include_tree(child, seen))
        return ordered


def labels_for(archive: Archive) -> dict[str, dict[str, str]]:
    result: dict[str, dict[str, str]] = {}
    for source in archive.converted_sources():
        target = destination(source)
        assert target
        for label in LABEL_RE.findall(archive.text[source]):
            result[label] = {"source": source, "path": target, "anchor": anchor(label)}
    return result


def inventory(archive: Archive) -> dict[str, object]:
    entries = [
        {
            "path": entry.filename,
            "size": entry.file_size,
            "extension": Path(entry.filename).suffix.lower(),
            "converted": bool(destination(entry.filename) and entry.file_size),
            "includes": archive.includes(entry.filename) if entry.filename.endswith(".tex") else [],
            "commentedIncludes": archive.includes(entry.filename, commented=True)
            if entry.filename.endswith(".tex")
            else [],
        }
        for entry in sorted(archive.entries.values(), key=lambda item: item.filename.lower())
    ]
    return {
        "archive": ARCHIVE.name,
        "sha256": sha256(ARCHIVE),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "entryCount": len(entries),
        "nonEmptyConvertedTexCount": len(archive.converted_sources()),
        "activePublicationTree": archive.include_tree(),
        "commentedPublicationInputs": archive.includes("main.tex", commented=True),
        "entries": entries,
    }


def source_manifest(archive: Archive, labels: dict[str, dict[str, str]]) -> dict[str, object]:
    files = []
    for source in sorted(archive.entries):
        entry = archive.entries[source]
        if not source.endswith(".tex") or not entry.file_size:
            continue
        target = destination(source)
        files.append(
            {
                "source": source,
                "destination": target,
                "disposition": "converted" if target else "structural",
                "reason": "Rulebook source note" if target else "LaTeX document metadata or unused front matter",
                "labels": [label for label, value in labels.items() if value["source"] == source],
                "includes": archive.includes(source),
            }
        )
    return {
        "archive": ARCHIVE.name,
        "sha256": sha256(ARCHIVE),
        "files": files,
        "summary": dict(Counter(item["disposition"] for item in files)),
    }


def source_only_markdown(archive: Archive) -> list[str]:
    mapped = {target for source in archive.entries if (target := destination(source))}
    current: set[str] = set()
    ignored_names = {"index.md", "_sidebar.md", RULE_INDEX, RULE_DESIGN}
    for path in VAULT.rglob("*.md"):
        relative = path.relative_to(VAULT)
        if path.name in ignored_names or any(part.startswith(".") for part in relative.parts):
            continue
        current.add(relative.as_posix())
    return sorted(current - mapped)


def migration_report(archive: Archive) -> str:
    unmatched = source_only_markdown(archive)
    renamed = [
        ("rules/08_profanes/", "rules/08_rast/", "Current vault name differs from authoritative source chapter"),
        ("rules/02_Schicksalspunkte.md", "rules/02_Charaktere.md", "Current source embeds the material in the characters chapter"),
    ]
    lines = [
        "# Nenneke V2 Markdown Migration Report",
        "",
        "The archive is authoritative. Files below have no direct source-file destination and are retained for review rather than deleted by the apply command.",
        "",
        "## Renamed Areas",
        "",
        "| Current path | Authoritative destination | Reason |",
        "| --- | --- | --- |",
    ]
    lines.extend(f"| `{old}` | `{new}` | {reason} |" for old, new, reason in renamed)
    lines.extend(["", "## Markdown-only Files", ""])
    lines.extend(f"- `historical-review`: `{path}`" for path in unmatched)
    return "\n".join(lines)


def replace_macro(text: str, command: str, before: str, after: str, labels: dict[str, dict[str, str]], unsupported: set[str], current: str) -> str:
    pattern = re.compile(rf"\\{command}\*?(?:\[[^\]]*\])?\{{([^{{}}]*)\}}")
    return pattern.sub(lambda match: before + clean_inline(match.group(1), labels, unsupported, current) + after, text)


def clean_inline(text: str, labels: dict[str, dict[str, str]], unsupported: set[str], current: str = "") -> str:
    text = text.replace("~", " ").replace("\\%", "%").replace("\\&", "&").replace("\\_", "_")
    text = text.replace("--", "–").replace("---", "—")
    text = re.sub(r"\\hyperref\[([^\]]+)\]\{([^{}]*)\}", lambda m: link_for(m.group(2), m.group(1), labels, current), text)
    text = re.sub(r"\\href\{([^{}]+)\}\{([^{}]*)\}", r"[\2](\1)", text)
    text = re.sub(r"\\(?:ref|autoref)\{([^{}]+)\}", lambda m: link_for(m.group(1), m.group(1), labels, current), text)
    for command, before, after in (("textbf", "**", "**"), ("textit", "*", "*"), ("emph", "*", "*"), ("texttt", "`", "`")):
        text = replace_macro(text, command, before, after, labels, unsupported, current)
    text = LABEL_RE.sub(lambda m: f'<a id="{anchor(m.group(1))}"></a>', text)
    text = re.sub(r"\\(?:mbox|textrm|textnormal|small|large|Large|normalsize|noindent|newpage|clearpage)\*?", "", text)
    text = re.sub(r"\\(?:vspace|hspace)\*?\{[^{}]*\}", "", text)
    text = re.sub(r"\\(?:begin|end)\{[^{}]+\}", "", text)
    text = re.sub(r"\\multicolumn\{[^{}]*\}\{[^{}]*\}\{([^{}]*)\}", r"\1", text)
    text = re.sub(r"\\(?:makecell|underline)\{([^{}]*)\}", r"\1", text)
    text = text.replace("\\approx", "≈").replace("\\ldots", "…")
    known = {"chapter", "section", "subsection", "subsubsection", "item", "input", "include", "includegraphics", "textit", "textbf", "emph", "texttt", "multicolumn", "makecell", "underline", "cellcolor", "newline", "color", "todo", "n"}
    for command in COMMAND_RE.findall(text):
        if command not in known:
            unsupported.add(command)
    text = re.sub(r"\\[A-Za-z@]+\*?(?:\[[^\]]*\])?\{([^{}]*)\}", r"\1", text)
    text = re.sub(r"\\[A-Za-z@]+\*?", "", text)
    text = text.replace("{", "").replace("}", "")
    return re.sub(r"[ \t]+", " ", text).strip()


def link_for(text: str, label: str, labels: dict[str, dict[str, str]], current: str) -> str:
    target = labels.get(label)
    if not target:
        return text
    return f"[{text}]({relative_link(current, target['path'])}#{target['anchor']})"


def markdown_table(raw: list[str], labels: dict[str, dict[str, str]], unsupported: set[str], current: str) -> list[str]:
    content = " ".join(raw)
    content = re.sub(r"\\(?:hline|cline\{[^}]+\})", "", content)
    rows = [row.strip() for row in re.split(r"\\\\", content) if row.strip()]
    cells = [[clean_inline(cell.strip(), labels, unsupported, current) for cell in row.split("&")] for row in rows]
    cells = [row for row in cells if row and any(cell for cell in row)]
    if not cells:
        return ["[Empty source table]"]
    width = max(len(row) for row in cells)
    cells = [row + [""] * (width - len(row)) for row in cells]
    lines = ["| " + " | ".join(cells[0]) + " |", "| " + " | ".join(["---"] * width) + " |"]
    lines.extend("| " + " | ".join(row) + " |" for row in cells[1:])
    return lines


def convert_tex(source: str, text: str, labels: dict[str, dict[str, str]], source_map: dict[str, str]) -> tuple[str, set[str]]:
    unsupported: set[str] = set()
    current = source_map[source]
    lines = strip_comments(text).splitlines()
    output = [f"<!-- Source: {source} -->", ""]
    table: list[str] | None = None
    quote = False
    list_type: str | None = None
    for raw in lines:
        line = raw.strip()
        if not line:
            if table is None and output and output[-1] != "":
                output.append("")
            continue
        if table is not None:
            if "\\end{tabular" in line:
                output.extend(markdown_table(table, labels, unsupported, current))
                output.append("")
                table = None
            else:
                table.append(line)
            continue
        if "\\begin{tabular" in line:
            table = []
            continue
        heading = re.match(r"\\(chapter|section|subsection|subsubsection)\*?\{(.+)\}", line)
        if heading:
            level = {"chapter": 1, "section": 2, "subsection": 3, "subsubsection": 4}[heading.group(1)]
            output.extend(["#" * level + " " + clean_inline(heading.group(2), labels, unsupported, current), ""])
            continue
        if line.startswith("\\label{"):
            label = re.match(r"\\label\{([^}]+)\}", line)
            if label:
                output.extend([f'<a id="{anchor(label.group(1))}"></a>', ""])
            continue
        if line.startswith("\\begin{quote}"):
            quote = True
            continue
        if line.startswith("\\end{quote}"):
            quote = False
            output.append("")
            continue
        if line.startswith("\\begin{enumerate}"):
            list_type = "ordered"
            continue
        if line.startswith("\\begin{itemize}"):
            list_type = "unordered"
            continue
        if line.startswith("\\end{enumerate}") or line.startswith("\\end{itemize}"):
            list_type = None
            output.append("")
            continue
        include = re.match(r"\\(?:input|include)\{([^}]+)\}", line)
        if include:
            child = normalise_tex_path(include.group(1), source)
            target = source_map.get(child)
            if target:
                output.extend([f"- [{title_for(child)}]({relative_link(current, target)})", ""])
            else:
                unsupported.add(f"unresolved-include:{child}")
            continue
        image = re.match(r"\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}", line)
        if image:
            name = image.group(1)
            output.extend([f"![{Path(name).stem}](../assets/{Path(name).name})", ""])
            continue
        if line.startswith("\\item"):
            marker = "1." if list_type == "ordered" else "-"
            output.append(f"{marker} {clean_inline(re.sub(r'^\\\\item\s*', '', line), labels, unsupported, current)}")
            continue
        cleaned = clean_inline(line, labels, unsupported, current)
        if cleaned:
            output.append(("> " if quote else "") + cleaned)
    return "\n".join(output), unsupported


def generate(archive: Archive, staging: Path = STAGING) -> dict[str, object]:
    if staging.exists():
        shutil.rmtree(staging)
    labels = labels_for(archive)
    sources = archive.converted_sources()
    source_map = {source: target for source in archive.entries if (target := destination(source))}
    children, parents = navigation_graph(archive, source_map)
    all_unsupported: dict[str, list[str]] = {}
    for source in sources:
        content, unsupported = convert_tex(source, archive.text[source], labels, source_map)
        target = staging / source_map[source]
        content = insert_after_h1(content, design_principles(source))
        write_text(target, content + note_navigation(source, source_map, children, parents))
        if unsupported:
            all_unsupported[source] = sorted(unsupported)
    for source, target in source_map.items():
        if source not in sources:
            content = f"<!-- Source: {source} -->\n\n# {title_for(source)}\n\n*Leere Quelldatei in der autoritativen Quelle.*"
            write_text(staging / target, content + note_navigation(source, source_map, children, parents))
    assets = staging / "assets"
    for name, entry in archive.entries.items():
        if Path(name).suffix.lower() in IMAGE_EXTENSIONS:
            target = assets / Path(name).name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(archive.zip.read(entry))
    publication_sources = archive.include_tree()
    publication_paths = [RULE_DESIGN, *[source_map[source] for source in publication_sources if source in source_map]]
    write_json(REPORTS / "inventory.json", inventory(archive))
    write_json(REPORTS / "manifest.json", source_manifest(archive, labels))
    write_json(REPORTS / "labels.json", labels)
    write_json(REPORTS / "unsupported-constructs.json", all_unsupported)
    write_json(
        REPORTS / "publication.json",
        {
            "title": "Nenneke",
            "subtitle": "V2",
            "contributors": "Patrick, Adrian, Isabel, Leonard, Pit, Kevin, Philipp",
            "language": "de",
            "paths": publication_paths,
            "excluded": archive.includes("main.tex", commented=True),
        },
    )
    write_text(REPORTS / "migration-report.md", migration_report(archive))
    write_text(staging / "index.md", generated_index(archive, source_map))
    write_text(staging / RULE_DESIGN, (DESIGN_PRINCIPLES / "00_regeldesign.md").read_text(encoding="utf-8"))
    write_text(staging / RULE_INDEX, generated_rule_index(source_map))
    write_text(staging / "_sidebar.md", generated_sidebar(archive, source_map, children))
    return {"sources": len(sources), "unsupported": all_unsupported, "publicationPaths": publication_paths}


def generated_index(archive: Archive, source_map: dict[str, str | None]) -> str:
    chapters = "\n".join(
        f"- [{title_for(source)}]({target})"
        for source in archive.includes("main.tex")
        if (target := source_map.get(source))
    )
    lookup = "\n".join(
        f"- [{title_for(source)}]({target})"
        for source in TABLE_LOOKUP_SOURCES
        if (target := source_map.get(source))
    )
    return (
        "# Nenneke\n\n"
        "Aktuelle, aus `NennekeV2.zip` erzeugte Regelwerksfassung.\n\n"
        "## Regelbuch lesen\n\n"
        f"- [Grundideen des Regeldesigns]({RULE_DESIGN})\n"
        f"{chapters}\n\n"
        "## Am Spieltisch\n\n"
        "Direkteinstiege für häufige Regelfragen:\n\n"
        f"{lookup}\n\n"
        "Für einzelne Begriffe nutze in Obsidian die Suche oder den Schnellwechsler."
        "\n\n## Vollständigkeit\n\n"
        f"- [Vollständiger Regelindex]({RULE_INDEX})"
    )


def generated_rule_index(source_map: dict[str, str]) -> str:
    sections: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for source, target in sorted(source_map.items(), key=lambda item: item[1].lower()):
        parts = Path(target).parts
        section = "Grundlagen" if len(parts) < 3 else parts[1].replace("_", " ")
        sections[section].append((source, target))
    lines = ["# Vollständiger Regelindex", "", "Alle aus der maßgeblichen Quelle erzeugten Regelnotizen."]
    for section, entries in sections.items():
        lines.extend(["", f"## {section}", ""])
        lines.extend(f"- [{title_for(source)}]({target})" for source, target in entries)
    return "\n".join(lines)


def generated_sidebar(archive: Archive, source_map: dict[str, str | None], children: dict[str, list[str]] | None = None) -> str:
    if children is None:
        mapped_sources = {source: target for source, target in source_map.items() if target}
        children, _ = navigation_graph(archive, mapped_sources)

    def render_branch(source: str, depth: int) -> list[str]:
        target = source_map.get(source)
        if not target:
            return []
        lines = ["  " * depth + f"- [{title_for(source)}]({target})"]
        if depth < 1:
            for child in children.get(source, []):
                lines.extend(render_branch(child, depth + 1))
        return lines

    lines = ["- [Startseite](index.md)", f"- [Grundideen des Regeldesigns]({RULE_DESIGN})"]
    for source in children.get("main.tex", []):
        lines.extend(render_branch(source, 0))
    lines.extend(["", f"- [Vollständiger Regelindex]({RULE_INDEX})"])
    return "\n".join(lines)


def apply_staging(archive: Archive, staging: Path = STAGING) -> None:
    if not staging.is_dir():
        raise FileNotFoundError("Run the convert command before apply.")
    legacy_root = VAULT / ".migration" / "legacy-markdown"
    for relative in source_only_markdown(archive):
        source = VAULT / relative
        target = legacy_root / relative
        if source.exists() and not target.exists():
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(source), str(target))
    for item in staging.iterdir():
        target = VAULT / item.name
        if item.is_dir():
            shutil.copytree(item, target, dirs_exist_ok=True)
        else:
            shutil.copy2(item, target)


def validate_reports(archive: Archive, staging: Path = STAGING) -> list[str]:
    issues: list[str] = []
    manifest = json.loads((REPORTS / "manifest.json").read_text(encoding="utf-8"))
    accounted = len(manifest["files"])
    expected = len(archive.converted_sources()) + sum(
        1
        for name, entry in archive.entries.items()
        if name.endswith(".tex") and entry.file_size and not destination(name)
    )
    if accounted != expected:
        issues.append(f"manifest accounts for {accounted} files; expected {expected}")
    for source in archive.converted_sources():
        target = staging / destination(source)  # type: ignore[arg-type]
        if not target.is_file():
            issues.append(f"missing generated note for {source}")
    for markdown_file in staging.rglob("*.md"):
        for match in MARKDOWN_LINK_RE.finditer(markdown_file.read_text(encoding="utf-8")):
            link = match.group(1)
            if "://" in link or link.startswith("mailto:"):
                continue
            destination_path = link.split("#", 1)[0]
            if not destination_path:
                continue
            if not (markdown_file.parent / destination_path).is_file():
                issues.append(f"broken Markdown link in {markdown_file.relative_to(staging)}: {link}")
    for required in ("inventory.json", "labels.json", "unsupported-constructs.json", "publication.json", "migration-report.md"):
        if not (REPORTS / required).exists():
            issues.append(f"missing report {required}")
    return issues


def build_pdf() -> None:
    try:
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_CENTER
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
        from reportlab.platypus.tableofcontents import TableOfContents
    except ImportError as error:
        raise RuntimeError("ReportLab is required. Install it with: python -m pip install reportlab") from error

    config = json.loads((REPORTS / "publication.json").read_text(encoding="utf-8"))
    PUBLICATION_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    class Document(BaseDocTemplate):
        def afterFlowable(self, flowable):  # type: ignore[no-untyped-def]
            if isinstance(flowable, Paragraph) and flowable.style.name in {"Heading1", "Heading2", "Heading3"}:
                level = {"Heading1": 0, "Heading2": 1, "Heading3": 2}[flowable.style.name]
                self.notify("TOCEntry", (level, flowable.getPlainText(), self.page))

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="TitlePage", parent=styles["Title"], alignment=TA_CENTER, fontSize=28, leading=34))
    styles.add(ParagraphStyle(name="TitlePageSubtitle", parent=styles["Normal"], fontSize=14, leading=18))
    styles.add(ParagraphStyle(name="ContentsHeading", parent=styles["Heading1"], pageBreakBefore=False))
    styles["Heading1"].spaceBefore = 18
    styles["Heading1"].pageBreakBefore = True
    doc = Document(str(PUBLICATION_OUTPUT), pagesize=letter, leftMargin=2 * cm, rightMargin=2 * cm, topMargin=1.25 * cm, bottomMargin=2.25 * cm)
    doc.title = config["title"]
    doc.author = config["contributors"]
    doc.addPageTemplates([PageTemplate(id="rulebook", frames=[Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")])])
    story = [Paragraph(config["title"], styles["TitlePage"]), Spacer(1, 1.5 * cm), Paragraph(config["subtitle"], styles["TitlePageSubtitle"]), Spacer(1, 2 * cm), Paragraph(config["contributors"], styles["Normal"]), PageBreak(), Paragraph("Inhaltsverzeichnis", styles["ContentsHeading"])]
    toc = TableOfContents()
    toc.levelStyles = [styles["Normal"], styles["BodyText"], styles["BodyText"]]
    story.extend([toc, PageBreak()])
    for rel in config["paths"]:
        path = STAGING / rel
        if path.exists():
            story.extend(markdown_flowables(path.read_text(encoding="utf-8"), styles, Paragraph, Table, TableStyle, colors))
    # The table of contents receives entries after headings are laid out, so it
    # needs ReportLab's multi-pass build rather than a single document pass.
    doc.multiBuild(story)


def markdown_flowables(text, styles, Paragraph, Table, TableStyle, colors):  # type: ignore[no-untyped-def]
    def pdf_inline(value: str) -> str:
        escaped = html.escape(value)
        escaped = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", escaped)
        escaped = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", escaped)
        escaped = re.sub(r"(?<!\*)\*([^*]+)\*", r"<i>\1</i>", escaped)
        escaped = re.sub(r"`([^`]+)`", r'<font face="Courier">\1</font>', escaped)
        return escaped

    def append_table(rows):  # type: ignore[no-untyped-def]
        cells = [[Paragraph(pdf_inline(cell), styles["BodyText"]) for cell in row] for row in rows]
        column_count = max(len(row) for row in cells)
        if column_count >= 4:
            first_width = 80 if column_count <= 6 else 38
            last_width = 140 if column_count <= 6 else 100
            middle_width = (460 - first_width - last_width) / (column_count - 2)
            widths = [first_width] + [middle_width] * (column_count - 2) + [last_width]
        else:
            widths = [460 / column_count] * column_count
        table = Table(cells, repeatRows=1, colWidths=widths)
        table.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.25, colors.grey), ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey), ("VALIGN", (0, 0), (-1, -1), "TOP")]))
        flowables.append(table)

    flowables = []
    table_rows = []
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("<!--") or line.startswith("<a ") or not line:
            continue
        if line.startswith("|") and line.endswith("|"):
            cells = [cell.strip() for cell in line.strip("|").split("|")]
            if not all(set(cell) <= {"-", ":", " "} for cell in cells):
                table_rows.append(cells)
            continue
        if table_rows:
            append_table(table_rows)
            table_rows = []
        match = re.match(r"^(#{1,4})\s+(.+)$", line)
        if match:
            style = {1: "Heading1", 2: "Heading2", 3: "Heading3", 4: "Heading4"}[len(match.group(1))]
            flowables.append(Paragraph(pdf_inline(match.group(2)), styles[style]))
        elif line.startswith("> "):
            flowables.append(Paragraph("<i>" + pdf_inline(line[2:]) + "</i>", styles["BodyText"]))
        elif re.match(r"^(?:- |\d+\. )", line):
            flowables.append(Paragraph("• " + pdf_inline(re.sub(r"^(?:- |\d+\. )", "", line)), styles["BodyText"]))
        else:
            flowables.append(Paragraph(pdf_inline(line), styles["BodyText"]))
    if table_rows:
        append_table(table_rows)
    return flowables


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("inventory", "convert", "apply", "validate", "publish"))
    args = parser.parse_args()
    archive = Archive()
    try:
        if args.command == "inventory":
            labels = labels_for(archive)
            write_json(REPORTS / "inventory.json", inventory(archive))
            write_json(REPORTS / "manifest.json", source_manifest(archive, labels))
            write_json(REPORTS / "labels.json", labels)
            write_text(REPORTS / "migration-report.md", migration_report(archive))
        elif args.command == "convert":
            generate(archive)
        elif args.command == "apply":
            apply_staging(archive)
        elif args.command == "validate":
            issues = validate_reports(archive)
            if issues:
                print("\n".join(issues), file=sys.stderr)
                return 1
        elif args.command == "publish":
            build_pdf()
    finally:
        archive.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
