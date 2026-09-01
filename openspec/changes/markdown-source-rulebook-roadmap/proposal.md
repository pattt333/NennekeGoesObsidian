## Why

The current vault is a complete Markdown representation of the ZIP archive, so the temporary LaTeX-first migration model can end. The next work must turn Markdown into the maintainable rulebook source while establishing the conventions, identities, PDF scope, automation, and retrieval contract needed for the future.

## What Changes

- **BREAKING** Promote the curated Markdown vault and editorial Markdown sources to the sole authoritative rulebook source; retire the ZIP archive and its conversion pipeline after a final completeness audit.
- Define concise German authoring conventions for headings, tables, rule boxes, examples, formulas, links, metadata, and source-managed assets.
- Add stable IDs to addressable rules and major rule sections, without assigning an ID to every paragraph.
- Replace the fixed PDF input list with a small versioned `book.yaml` and a build-only Markdown entry tree. The tree uses recursive Obsidian embeds for book inclusion and keeps normal links as cross-references.
- Add a GitHub Actions build workflow for merges to `main` that validates Markdown and generates the PDF as a build artifact.
- Prepare a provider-neutral, citation-oriented retrieval contract for a future external RAG service; Discord and Foundry remain outside this repository.

## Capabilities

### New Capabilities

- `markdown-authoritative-rulebook`: Maintain the rulebook directly in Markdown without a required LaTeX source archive or regeneration step.
- `rulebook-authoring-conventions`: Give contributors a compact, documented Markdown convention for all supported rulebook structures.
- `stable-rule-identifiers`: Give addressable rule notes and major sections durable IDs independent of file names.
- `configurable-rulebook-publication`: Build a PDF from a declarative book configuration and recursive build-only include tree, with selected, extensible spell and liturgy content.
- `continuous-pdf-build`: Validate and build the PDF automatically on merges to `main`.
- `retrieval-ready-rulebook`: Expose a local, provider-neutral corpus and citation contract for a later external RAG service.

### Modified Capabilities

- None.

## Impact

- Affected source strategy: `NennekeV2.zip`, `conversion/nenneke-v2/`, and `scripts/nenneke_v2_pipeline.py` are retired only after the audit passes.
- Affected content: all source Markdown under `vault/` and editorial content presently held under `content/`.
- Affected publication: PDF tooling and a new publication-selection manifest.
- Affected automation: `.github/workflows/` is introduced.
- No Discord bot, Foundry module, API keys, vector database, or RAG server is added to this repository.

## Validation Impact

- Audit Markdown coverage before removing the ZIP and prove the retired pipeline is no longer required.
- Validate authoring structure, IDs, links, orphan reachability, and the selected publication manifest.
- Run the PDF build locally and in GitHub Actions; inspect representative rendered pages.
- Validate retrieval export and citation mappings with deterministic fixture queries, without calling an LLM provider.
