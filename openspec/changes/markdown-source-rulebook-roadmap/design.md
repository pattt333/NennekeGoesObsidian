## Context

The vault now contains the reviewed Markdown counterpart of the complete ZIP-derived rulebook, plus source-managed editorial design principles. The ZIP conversion pipeline was useful for migration, but it prevents direct editorial maintenance because regeneration overwrites Markdown changes. The repository has a local ReportLab PDF build and no CI, YAML metadata, canonical rule IDs, or retrieval corpus.

## Goals / Non-Goals

**Goals:**

- Make Markdown the only rule-content source and retain Git history as the rollback mechanism.
- Give authors a small convention, stable note identity, and deterministic publication selection.
- Build an expanding PDF selection automatically after merges to `main`.
- Prepare data contracts for a later external RAG service without adding clients or credentials here.

**Non-Goals:**

- Reintroduce LaTeX, Discord, Foundry, a RAG server, a vector database, or API keys.
- Require YAML metadata on every explanatory paragraph.
- Automatically publish every spell or liturgy merely because it exists in the vault.
- Commit generated PDF files back to `main`.

## Decisions

### 1. Promote the existing Markdown tree after an audit

The promotion change first records an immutable baseline: file count, the current ZIP checksum, mapped source list, and link/orphan results. It then moves editorial sources into the authoring tree, retires conversion scripts, reports, package commands, and the ZIP, and updates maintenance documentation. Git history, rather than a retained ZIP, is the rollback path.

Alternative: retain the ZIP only for provenance. Rejected because it creates two apparent sources and contradicts the decision that Markdown is now authoritative.

### 2. Keep portable Markdown links

Authors use relative Markdown links for rulebook references because they render in both Obsidian and Docsify. Wikilinks are optional only in explicitly Obsidian-only private notes, which are not part of published rule content. A validator must cover normal Markdown links, not only wikilinks.

### 3. Use small, explicit frontmatter

Addressable rule notes receive YAML frontmatter with `id`, `title`, `type`, and `tags`. IDs use a readable namespace such as `combat.initiative`; file paths remain free to evolve. Major subsections use their heading anchor by default. Add an explicit subsection ID only where a future client needs a stable target beyond the note.

### 4. Make PDF order source-managed and additive

A small versioned `book.yaml` contains the build configuration and identifies a dedicated build entry point such as `vault/book/index.md`. The reader-facing `vault/index.md` remains the concise Docsify/Obsidian home page; it is not compiled as a giant book page.

The build entry tree owns the one canonical PDF order. Its `![[...]]` embeds mean “include this Markdown file here”; normal relative Markdown links and `[[...]]` links remain cross-references and do not cause inclusion. The resolver expands embeds recursively, resolves relative and vault-wide targets, detects duplicates and cycles, and hands Pandoc the resulting linear file list. Selected spells and liturgies are added only through embeds in that tree, so the selection can grow without a second ordered manifest.

The PDF implementation is selected by a small fidelity spike, with Pandoc plus Typst as the preferred Markdown-first candidate; the selected toolchain must run locally and in CI.

### 5. Build but do not commit or release generated PDFs in CI

`.github/workflows/build.yml` runs on pushes to `main` and manually. It validates the vault, builds the PDF, and uploads it as a workflow artifact. It neither commits generated output nor creates releases; publication destinations are a later product decision.

### 6. Prepare RAG inputs, not an RAG product

An export command produces deterministic records containing rule ID, title, section heading, source path, canonical link, content, and content hash. This gives a future service citations and chunk boundaries without coupling the vault to DeepSeek, OpenRouter, Discord, Foundry, or a retrieval implementation.

## Content and Link Impact

- The current `vault/` structure remains readable while its contents become directly editable.
- Editorial design principles move from generator input to authored vault content without changing their reader-visible paths.
- Existing relative Markdown links are preserved; rename/move work requires link updates and validation.
- `vault/book/index.md` controls PDF inclusion and ordering independently from whether a note exists in the vault.

## Risks / Trade-offs

- [A missed ZIP-only detail is lost] → complete the baseline audit and review its diff before deleting the archive.
- [Frontmatter makes notes noisy] → keep required fields minimal and generate repetitive metadata where practical.
- [PDF fidelity regresses during toolchain replacement] → require a representative visual comparison before retiring the current build.
- [Unselected magic material is expected in the PDF] → keep the explicit selection visible in the build include tree.
- [A Docsify page accidentally expands an entire book] → use a dedicated build entry point rather than the reader home page.
- [Embed cycles or repeated notes create malformed PDFs] → fail the resolver with the resolved include chain.
- [RAG preparation expands into a server project] → limit this repository to deterministic export and citation validation.

## Migration Plan

1. Audit and promote Markdown to the source of truth; commit before deleting the conversion toolchain.
2. Introduce conventions and normal Markdown-link validation.
3. Add note IDs and a checked ID registry/export.
4. Introduce `book.yaml`, the recursive build entry tree, and the PDF builder after a fidelity spike.
5. Add the GitHub Actions PDF workflow.
6. Add a retrieval export contract in a separate follow-up change.

Each stage is independently revertible through Git.

## Open Questions

- Which exact spells and liturgies form the first build include selection?
- Which PDF fidelity criteria are required before selecting Pandoc plus Typst over the current ReportLab build?
