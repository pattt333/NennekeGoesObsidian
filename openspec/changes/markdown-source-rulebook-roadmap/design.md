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

### 4. Make PDF scope declarative and additive

A versioned `publication.yml` names the ordered core chapters and optional selected spell/liturgy notes. A selection is additive: new spell/liturgy content enters the PDF only when listed. The PDF implementation is selected by a small fidelity spike, with Pandoc plus Typst as the preferred Markdown-first candidate; the selected toolchain must run locally and in CI.

### 5. Build but do not commit generated PDFs in CI

`.github/workflows/build.yml` runs on pushes to `main` and manually. It validates the vault, builds the PDF, and uploads it as a workflow artifact. Release attachment, Pages publication, or another distribution channel is a later product decision.

### 6. Prepare RAG inputs, not an RAG product

An export command produces deterministic records containing rule ID, title, section heading, source path, canonical link, content, and content hash. This gives a future service citations and chunk boundaries without coupling the vault to DeepSeek, OpenRouter, Discord, Foundry, or a retrieval implementation.

## Content and Link Impact

- The current `vault/` structure remains readable while its contents become directly editable.
- Editorial design principles move from generator input to authored vault content without changing their reader-visible paths.
- Existing relative Markdown links are preserved; rename/move work requires link updates and validation.
- `publication.yml` controls PDF inclusion independently from whether a note exists in the vault.

## Risks / Trade-offs

- [A missed ZIP-only detail is lost] → complete the baseline audit and review its diff before deleting the archive.
- [Frontmatter makes notes noisy] → keep required fields minimal and generate repetitive metadata where practical.
- [PDF fidelity regresses during toolchain replacement] → require a representative visual comparison before retiring the current build.
- [Unselected magic material is expected in the PDF] → display and document selection explicitly in the publication manifest.
- [RAG preparation expands into a server project] → limit this repository to deterministic export and citation validation.

## Migration Plan

1. Audit and promote Markdown to the source of truth; commit before deleting the conversion toolchain.
2. Introduce conventions and normal Markdown-link validation.
3. Add note IDs and a checked ID registry/export.
4. Introduce declarative publication selection and migrate the PDF builder after a fidelity spike.
5. Add the GitHub Actions PDF workflow.
6. Add a retrieval export contract in a separate follow-up change.

Each stage is independently revertible through Git.

## Open Questions

- Which exact spells and liturgies form the first PDF supplement list?
- Should the first public CI output remain a downloadable workflow artifact only, or also be attached to a GitHub Release?
- Which PDF fidelity criteria are required before selecting Pandoc plus Typst over the current ReportLab build?
