#!/usr/bin/env node
"use strict";

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const VAULT = path.join(ROOT, "vault");
const HEALTH_SEGMENT_FILTER = path.join(ROOT, "scripts", "health-segment-tables.lua");
const RULE_EXAMPLE_FILTER = path.join(ROOT, "scripts", "pdf-rule-examples.lua");
const ADDRESSABLE_ROOTS = [path.join(VAULT, "rules"), path.join(VAULT, "grundideen-des-regeldesigns.md")];
const EXTERNAL_LINK = /^(?:[a-z][a-z0-9+.-]*:|#)/i;
const EMBED_RE = /!\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
const WIKILINK_RE = /!?\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
const MARKDOWN_LINK_RE = /(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^)]*['"])?\)/g;

function markdownFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) markdownFiles(candidate, files);
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(candidate);
  }
  return files.sort();
}

function addressableFiles(vault = VAULT) {
  const rules = path.join(vault, "rules");
  const files = fs.existsSync(rules) ? markdownFiles(rules) : [];
  const principles = path.join(vault, "grundideen-des-regeldesigns.md");
  if (fs.existsSync(principles)) files.unshift(principles);
  return files;
}

function slug(value) {
  return value
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\d+[_ -]*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "note";
}

function headingSlug(value) {
  return slug(value).replace(/-/g, "-");
}

function splitFrontmatter(content) {
  const lineEnding = content.startsWith("---\r\n") ? "\r\n" : "\n";
  const opening = `---${lineEnding}`;
  if (!content.startsWith(opening)) return { fields: {}, body: content };
  const closingDelimiter = `${lineEnding}---${lineEnding}`;
  const closing = content.indexOf(closingDelimiter, opening.length);
  if (closing < 0) throw new Error("Unclosed YAML frontmatter.");
  const frontmatter = content.slice(opening.length, closing).split(/\r?\n/);
  const fields = { tags: [] };
  let listKey = null;
  for (const line of frontmatter) {
    const list = line.match(/^\s*-\s+(.+)$/);
    if (list && listKey) {
      fields[listKey].push(parseScalar(list[1]));
      continue;
    }
    const pair = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!pair) continue;
    const [, key, raw] = pair;
    if (!raw) {
      fields[key] = [];
      listKey = key;
    } else {
      fields[key] = parseScalar(raw);
      listKey = null;
    }
  }
  return { fields, body: content.slice(closing + closingDelimiter.length) };
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"')) {
    try { return JSON.parse(trimmed); } catch { return trimmed.slice(1, -1); }
  }
  return trimmed.replace(/^'|'$/g, "");
}

function titleFrom(content, fallback) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function deriveId(file, vault = VAULT) {
  const relative = path.relative(vault, file).replace(/\\/g, "/").replace(/\.md$/, "");
  if (relative === "grundideen-des-regeldesigns") return "design.regeldesign";
  const parts = relative.split("/");
  if (parts[0] === "rules") parts.shift();
  return ["rule", ...parts.map(slug)].join(".");
}

function yaml(value) {
  return JSON.stringify(String(value));
}

function renderFrontmatter(fields, lineEnding = "\n") {
  return [
    "---",
    `id: ${fields.id}`,
    `title: ${yaml(fields.title)}`,
    `type: ${fields.type}`,
    "tags:",
    ...fields.tags.map(tag => `  - ${tag}`),
    "---",
    "",
  ].join(lineEnding);
}

function assignIds(vault = VAULT) {
  const seen = new Map();
  const changes = [];
  for (const file of addressableFiles(vault)) {
    const content = fs.readFileSync(file, "utf8");
    const { fields, body } = splitFrontmatter(content);
    const lineEnding = content.includes("\r\n") ? "\r\n" : "\n";
    const id = fields.id || deriveId(file, vault);
    if (seen.has(id)) throw new Error(`Duplicate rule ID ${id}: ${file} and ${seen.get(id)}`);
    seen.set(id, file);
    const type = fields.type || (id.startsWith("design.") ? "design-principles" : "rule");
    const relative = path.relative(path.join(vault, "rules"), file);
    const primaryTag = id.startsWith("design.") ? "design" : slug(relative.split(path.sep)[0]);
    const tags = Array.isArray(fields.tags) && fields.tags.length ? fields.tags.map(slug) : [primaryTag];
    const next = renderFrontmatter({ id, title: fields.title || titleFrom(body, path.basename(file, ".md")), type, tags }, lineEnding) + body.replace(/^\r?\n+/, "");
    if (next !== content) {
      fs.writeFileSync(file, next, "utf8");
      changes.push(path.relative(vault, file).replace(/\\/g, "/"));
    }
  }
  return changes;
}

function resolveTarget(rawTarget, source, vault = VAULT) {
  let target = rawTarget.trim().replace(/^<|>$/g, "");
  if (!target || EXTERNAL_LINK.test(target)) return null;
  target = decodeURIComponent(target.split("#", 1)[0]);
  if (!target) return source;
  const candidates = [];
  if (target.startsWith("/")) candidates.push(path.join(vault, target.slice(1)));
  else {
    candidates.push(path.resolve(path.dirname(source), target));
    candidates.push(path.join(vault, target));
  }
  for (let candidate of candidates) {
    if (!path.extname(candidate)) candidate += ".md";
    const normalized = path.normalize(candidate);
    if (normalized.startsWith(path.normalize(vault + path.sep)) && fs.existsSync(normalized)) return normalized;
  }
  return undefined;
}

function validateLinks(vault = VAULT) {
  const failures = [];
  let linkCount = 0;
  for (const file of markdownFiles(vault)) {
    const content = fs.readFileSync(file, "utf8");
    for (const [regex, kind] of [[WIKILINK_RE, "Obsidian"], [MARKDOWN_LINK_RE, "Markdown"]]) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(content)) !== null) {
        linkCount += 1;
        const resolved = resolveTarget(match[1], file, vault);
        if (resolved === undefined) failures.push({ file, target: match[1], kind });
      }
    }
  }
  if (failures.length) {
    const details = failures.map(({ file, target, kind }) => `${path.relative(vault, file)}: ${kind} link ${target}`).join("\n");
    throw new Error(`Broken rulebook links:\n${details}`);
  }
  return linkCount;
}

function validateMetadata(vault = VAULT) {
  const ids = new Map();
  const errors = [];
  for (const file of addressableFiles(vault)) {
    const { fields } = splitFrontmatter(fs.readFileSync(file, "utf8"));
    const relative = path.relative(vault, file);
    if (!fields.id || !/^[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)*$/.test(fields.id)) errors.push(`${relative}: invalid id`);
    else if (ids.has(fields.id)) errors.push(`${relative}: duplicate id ${fields.id}`);
    else ids.set(fields.id, file);
    if (!fields.title) errors.push(`${relative}: missing title`);
    if (!fields.type) errors.push(`${relative}: missing type`);
    if (!Array.isArray(fields.tags) || !fields.tags.length) errors.push(`${relative}: missing tags`);
  }
  if (errors.length) throw new Error(`Invalid rule metadata:\n${errors.join("\n")}`);
  return ids.size;
}

function bookConfig(root = ROOT) {
  const config = fs.readFileSync(path.join(root, "book.yaml"), "utf8");
  const setting = name => {
    const match = config.match(new RegExp(`^\\s*${name}:\\s*([^#\\r\\n]+)`, "m"));
    return match && match[1].trim().replace(/^['"]|['"]$/g, "");
  };
  return {
    entrypoint: setting("entrypoint"),
    output: setting("file"),
    title: setting("title") || "Nenneke",
    pdfEngine: setting("pdf_engine") || "typst",
  };
}

function resolveEmbed(rawTarget, source, vault = VAULT) {
  const target = rawTarget.trim();
  const candidates = target.startsWith("/")
    ? [path.join(vault, target.slice(1))]
    : [path.resolve(path.dirname(source), target), path.join(vault, target)];
  for (let candidate of candidates) {
    if (!path.extname(candidate)) candidate += ".md";
    const normalized = path.normalize(candidate);
    if (normalized.startsWith(path.normalize(vault + path.sep)) && fs.existsSync(normalized)) return normalized;
  }
  throw new Error(`Missing book include ${rawTarget} from ${path.relative(vault, source)}`);
}

function resolveBookTree(entrypoint, vault = VAULT) {
  const ordered = [];
  const included = new Set();
  function walk(file, chain) {
    if (chain.includes(file)) {
      throw new Error(`Book include cycle: ${[...chain, file].map(item => path.relative(vault, item)).join(" -> ")}`);
    }
    if (included.has(file)) {
      throw new Error(`Book include duplicates ${path.relative(vault, file)} via ${[...chain, file].map(item => path.relative(vault, item)).join(" -> ")}`);
    }
    included.add(file);
    ordered.push(file);
    const content = fs.readFileSync(file, "utf8");
    for (const match of content.matchAll(EMBED_RE)) walk(resolveEmbed(match[1], file, vault), [...chain, file]);
  }
  walk(entrypoint, []);
  return ordered;
}

function resolveConfiguredBook(root = ROOT) {
  const config = bookConfig(root);
  if (!config.entrypoint) throw new Error("book.yaml is missing book.entrypoint.");
  const entrypoint = path.resolve(root, config.entrypoint);
  if (!entrypoint.startsWith(path.normalize(VAULT + path.sep)) || !fs.existsSync(entrypoint)) {
    throw new Error(`Invalid book entrypoint: ${config.entrypoint}`);
  }
  return { config, files: resolveBookTree(entrypoint, VAULT) };
}

function buildPdf(root = ROOT) {
  const { config, files } = resolveConfiguredBook(root);
  if (!config.output) throw new Error("book.yaml is missing output.file.");
  const buildDirectory = path.join(root, "build");
  fs.mkdirSync(buildDirectory, { recursive: true });
  const parts = [];
  let chapterBreakPending = false;
  for (const file of files) {
    const relative = path.relative(VAULT, file);
    if (relative.startsWith(path.join("book", "chapters") + path.sep)) {
      chapterBreakPending = true;
      continue;
    }
    const content = splitFrontmatter(fs.readFileSync(file, "utf8")).body
      .replace(EMBED_RE, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^\*\*Regelbuchnavigation:\*\*.*$/gm, "")
      .replace(/(?:\r?\n\s*---\s*)+$/g, "")
      .replace(/^(\*\*[^*\r\n]+:\*\*)\r?\n(?=-\s)/gm, "$1\n\n")
      .trim();
    if (!content) continue;
    if (chapterBreakPending) {
      parts.push("\`\`\`{=typst}\n#pagebreak()\n\`\`\`");
      chapterBreakPending = false;
    }
    parts.push(content);
  }
  const combined = ["\`\`\`{=typst}\n#pagebreak()\n\`\`\`", ...parts].join("\n\n\n") + "\n";
  const intermediate = path.join(buildDirectory, "Nenneke.md");
  const output = path.resolve(root, config.output);
  fs.writeFileSync(intermediate, combined, "utf8");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = spawnSync("pandoc", [intermediate, "--from=markdown+raw_html", "--lua-filter", HEALTH_SEGMENT_FILTER, "--lua-filter", RULE_EXAMPLE_FILTER, "--output", output, "--toc", "--number-sections", "--top-level-division=chapter", `--pdf-engine=${config.pdfEngine}`, "--metadata", `title=${config.title}`, "--metadata", "lang=de-DE"], { cwd: root, encoding: "utf8" });
  if (result.error) throw new Error(`Could not run pandoc: ${result.error.message}`);
  if (result.status !== 0) throw new Error(result.stderr || "Pandoc PDF build failed.");
  return { output, files };
}

function exportRag(vault = VAULT, destination = path.join(ROOT, "build", "rag", "rulebook.jsonl")) {
  const records = [];
  for (const file of addressableFiles(vault)) {
    const content = fs.readFileSync(file, "utf8");
    const { fields, body } = splitFrontmatter(content);
    const headings = [...body.matchAll(/^##\s+(.+)$/gm)];
    const sections = headings.length ? headings.map((match, index) => ({
      heading: match[1].trim(),
      content: body.slice(match.index, headings[index + 1] ? headings[index + 1].index : body.length).trim(),
    })) : [{ heading: fields.title, content: body.trim() }];
    const relative = path.relative(vault, file).replace(/\\/g, "/");
    for (const section of sections) {
      const anchor = headingSlug(section.heading);
      const record = {
        ruleId: fields.id,
        title: fields.title,
        section: section.heading,
        canonicalLink: `/${relative}#${anchor}`,
        sourcePath: relative,
        content: section.content,
      };
      record.contentHash = crypto.createHash("sha256").update(record.content).digest("hex");
      records.push(record);
    }
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, records.map(record => JSON.stringify(record)).join("\n") + "\n", "utf8");
  return records.length;
}

function selfTest() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "nenneke-book-"));
  const vault = path.join(temporary, "vault");
  fs.mkdirSync(vault, { recursive: true });
  const write = (name, value) => {
    const target = path.join(vault, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, value, "utf8");
    return target;
  };
  const root = write("book/index.md", "![[chapter]]\n");
  write("book/chapter.md", "![[nested]]\n");
  write("book/nested.md", "# Nested\n");
  assert.deepStrictEqual(resolveBookTree(root, vault).map(file => path.relative(vault, file).split(path.sep).join("/")), ["book/index.md", "book/chapter.md", "book/nested.md"]);
  write("book/nested.md", "![[index]]\n");
  assert.throws(() => resolveBookTree(root, vault), /cycle/);
  write("rules/test.md", "---\nid: rule.test\ntitle: \"Test\"\ntype: rule\ntags:\n  - test\n---\n\n# Test\n\n## Abschnitt\n\nInhalt\n");
  const exportFile = path.join(temporary, "records.jsonl");
  assert.strictEqual(exportRag(vault, exportFile), 1);
  const record = JSON.parse(fs.readFileSync(exportFile, "utf8"));
  assert.deepStrictEqual(record, {
    ruleId: "rule.test",
    title: "Test",
    section: "Abschnitt",
    canonicalLink: "/rules/test.md#abschnitt",
    sourcePath: "rules/test.md",
    content: "## Abschnitt\n\nInhalt",
    contentHash: crypto.createHash("sha256").update("## Abschnitt\n\nInhalt").digest("hex"),
  });
  write("rules/crlf.md", "---\r\nid: rule.crlf\r\ntitle: \"CRLF\"\r\ntype: rule\r\ntags:\r\n  - test\r\n---\r\n\r\n# CRLF\r\n");
  assert.strictEqual(validateMetadata(vault), 2);
  const segmentFilter = spawnSync("pandoc", ["--from=markdown+raw_html", "--to=typst", "--lua-filter", HEALTH_SEGMENT_FILTER], {
    input: "| Segment | <span class=\"health-segment--critical\">1.</span> | <span class=\"health-segment--safe\">7.+8.</span> |\n| --- | --- | --- |\n| **50 LeP** | 1-7 | 43-50 |\n",
    encoding: "utf8",
  });
  if (segmentFilter.error) throw new Error(`Could not run health segment filter test: ${segmentFilter.error.message}`);
  if (segmentFilter.status !== 0) throw new Error(segmentFilter.stderr || "Health segment filter test failed.");
  assert.match(segmentFilter.stdout, /fill: rgb\("#f89883"\)/);
  assert.match(segmentFilter.stdout, /fill: rgb\("#80fa99"\)/);
  fs.rmSync(temporary, { recursive: true, force: true });
}

function main() {
  const command = process.argv[2];
  try {
    if (command === "assign-ids") console.log(`Updated ${assignIds().length} rule notes.`);
    else if (command === "validate") console.log(`Validated ${validateMetadata()} IDs and ${validateLinks()} links.`);
    else if (command === "resolve-book") console.log(resolveConfiguredBook().files.map(file => path.relative(ROOT, file).replace(/\\/g, "/")).join("\n"));
    else if (command === "build-pdf") {
      const result = buildPdf();
      console.log(`Built ${path.relative(ROOT, result.output)} from ${result.files.length} Markdown files.`);
    } else if (command === "export-rag") console.log(`Exported ${exportRag()} citation records.`);
    else if (command === "self-test") { selfTest(); console.log("Rulebook tool tests passed."); }
    else throw new Error("Usage: rulebook-tools.js <assign-ids|validate|resolve-book|build-pdf|export-rag|self-test>");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { assignIds, buildPdf, exportRag, resolveBookTree, validateLinks, validateMetadata };
