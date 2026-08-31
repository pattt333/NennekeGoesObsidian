## Context

`NennekeV2.zip` contains 664 LaTeX files, of which 656 are non-empty content files. The current vault has 633 content Markdown files: 626 source filenames have a counterpart, but the conversion is not faithful. For example, `vault/rules/01_Proben.md` omits current source text and contains malformed generated Markdown. The archive's `main.tex` defines the initial publication as title material, a table of contents, and chapters 1-9; Appendix A, spells, and liturgies are commented out.

The existing `tex_to_html.py` is a basic HTML converter that does not resolve the LaTeX include tree or faithfully handle the rulebook's full set of structures. Neither Pandoc nor a LaTeX PDF engine is available in the current environment.

## Goals / Non-Goals

**Goals:**

- Make the archive's selected LaTeX content the auditable source of the vault.
- Produce clean, navigable Markdown that works in both Obsidian and Docsify.
- Preserve rulebook semantics and source structure before optimizing note granularity.
- Provide an on-demand PDF build that visually matches the reference publication's hierarchy and scope.
- Make conversion coverage, exclusions, and validation results reviewable and repeatable.

**Non-Goals:**

- Recreate the LaTeX layout pixel-for-pixel or preserve every LaTeX implementation detail.
- Add Foundry integrations, Discord features, or end-to-end tests.
- Publish Appendix A, spell, or liturgy content in the first regenerated PDF.
- Silently delete existing Markdown that has no source counterpart.

## Decisions

### 1. Treat the archive as an immutable, identified input

The converter SHALL read `NennekeV2.zip` directly into a temporary workspace and record its SHA-256 checksum, entry list, include graph, and conversion timestamp in a committed manifest. This makes a conversion reproducible without treating unpacked temporary files as source files.

Alternative considered: extract the archive permanently into `vault/`. This would mix authoring input with rendered Markdown and make the canonical source unclear.

### 2. Use a source-aware conversion pipeline rather than patching old Markdown

The pipeline SHALL resolve `\\include` and `\\input` references from `main.tex`, retain a source-to-destination mapping, and convert supported LaTeX structures into Markdown. It SHALL use a tested parser/converter path with targeted post-processing for rulebook-specific labels, internal links, tables, quotations, and custom environments.

The existing `tex_to_html.py` is a reference only; it SHALL not be the production conversion path because it drops include relationships and emits HTML rather than maintainable Markdown.

Alternative considered: manually patch the existing vault. This cannot reliably remove stale text or prove coverage across hundreds of source files.

### 3. Preserve a one-to-one source mapping before consolidating notes

Each converted non-root source file SHALL have a manifest entry and a stable Markdown destination. Chapter entry notes SHALL provide the Docsify/Obsidian navigation hierarchy. When a source file is structurally included by another file, the conversion may use an overview note plus individual child notes, but the manifest SHALL preserve the source relationship.

Existing Markdown-only files SHALL be classified as mapped, migrated, historical, or obsolete in a migration report before any removal. Existing links SHALL be updated from that report rather than inferred from filenames alone.

Alternative considered: retain the current aggregated notes as the canonical destination. This hides source coverage, cannot represent new source files cleanly, and preserves damaged conversion output.

### 4. Generate PDF from the converted Markdown with a dedicated publication configuration

The build SHALL assemble an explicit ordered list of Markdown inputs, then invoke a documented Markdown-to-PDF toolchain. The toolchain will be chosen after a small fidelity spike; the expected baseline is Pandoc plus a German-capable LaTeX engine because it supports a real table of contents, page numbering, tables, and book-style PDF metadata. The project SHALL install or document its required local dependencies instead of relying on globally available tools.

The publication configuration SHALL set title, contributors, language, margins, typography, output path, and chapter order independently from note filenames. The initial output scope mirrors the reference PDF's active `main.tex` include tree.

Alternative considered: render Docsify in a browser. It is viable for web-style PDFs but is less reliable for book-style page numbering and a multi-page table of contents.

### 5. Validate before replacing tracked content

The conversion SHALL first generate into a staging location and emit inventory, coverage, link, and PDF validation reports. Only after review SHALL the generated vault content replace stale tracked Markdown. Git provides rollback through the preceding commit; the converter itself SHALL not delete source or historical content.

## Content and Link Impact

- `vault/rules/` will be rebuilt from the source mapping, including chapter entry notes and child notes.
- `vault/index.md` and `vault/_sidebar.md` will be regenerated from the approved chapter hierarchy.
- Existing Markdown links and source labels will be mapped to stable paths and anchors; unresolved or ambiguous links will be reported rather than silently rewritten.
- The source's `08_rast` chapter and the existing `08_profanes` area require an explicit migration mapping.

## Validation Strategy

- Assert that every non-empty relevant `.tex` entry has one manifest disposition: converted, structural, generated, or explicitly excluded with a reason.
- Compare a representative set of every chapter, nested include group, table type, quote type, image, and internal reference against the archive.
- Run `npm run validate:links` after regenerated content/navigation and `npm run validate:orphans` after the new source-driven layout is in place.
- Build the PDF twice from a clean working directory and verify identical structure, title material, table of contents, chapter order, scope, and output location.
- Render and visually inspect the title page, table of contents, one table-heavy page, one quote-heavy page, every chapter boundary, and the final page against `NennekeV6_3_1.pdf`.

## Risks / Trade-offs

- [Complex LaTeX macros or custom environments lose meaning during generic conversion] → Build a corpus inventory first, add explicit transformations, and block replacement on unsupported constructs.
- [Current Markdown-only files contain intentional user content] → Classify every unmatched file in the migration report and retain it until explicitly approved for removal.
- [Source links or labels do not map cleanly to Obsidian anchors] → Generate a stable link crosswalk and report ambiguous targets.
- [PDF toolchain produces poor German typography or tables] → Run a fidelity spike before selecting it and keep the reference PDF as the visual acceptance target.
- [Large generated diff obscures mistakes] → Stage conversion output separately, review manifest summaries and representative diffs, then commit task-scoped changes only after validation.

## Migration Plan

1. Snapshot the tracked vault state and record the archive checksum.
2. Build and review the inventory, conversion manifest, and unsupported-construct report.
3. Generate Markdown and navigation into a staging location; validate coverage and links.
4. Review representative content and classify Markdown-only files.
5. Replace approved vault files, run validation, build and visually inspect the PDF, then automatically commit the scoped change.
6. Roll back by reverting that commit; the archive and migration reports remain available to reproduce the conversion.

## Open Questions

- Should `08_rast` retain that source name in the vault, or should it migrate to the existing reader-facing `08_profanes` name with a documented mapping?
- Which Markdown-only files, especially `rules/combat/initiative.md`, should remain as post-source notes rather than be archived?
- Should the source archive itself be committed under a dedicated `sources/` directory, or retained as a controlled external input identified only by checksum?
