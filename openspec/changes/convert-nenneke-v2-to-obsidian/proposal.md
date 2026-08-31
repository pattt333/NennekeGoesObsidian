## Why

`NennekeV2.zip` is the current LaTeX source of truth, while the existing Obsidian vault is an older and partly lossy conversion. The vault must become a maintainable, complete Markdown representation of the current rulebook and be able to produce a publication-quality PDF with the scope and hierarchy of `NennekeV6_3_1.pdf`.

## What Changes

- Add a versioned source inventory and conversion manifest that maps every relevant LaTeX source file to its Markdown destination and records intentional exclusions.
- Replace stale Markdown rule content with conversions from `NennekeV2.zip`, preserving headings, prose, tables, lists, quotations, labels, images, and internal references in Obsidian-friendly Markdown.
- Rebuild vault navigation and wikilinks around the converted source structure.
- Add a reproducible Markdown-to-PDF publication workflow. Its initial publication scope mirrors `NennekeV6_3_1.pdf`: title material, table of contents, and chapters 1-9; Appendix A, spells, and liturgies remain available in the vault but are not included in that initial PDF.
- Add conversion and publication validation, including source coverage, Markdown/link checks, and visual review of the generated PDF.

## Capabilities

### New Capabilities

- `latex-source-inventory`: Maintain an auditable inventory of the LaTeX archive, its source-to-vault mapping, and declared publication scope.
- `latex-to-obsidian-conversion`: Convert the authoritative LaTeX rulebook into complete, navigable, Obsidian-compatible Markdown.
- `rulebook-pdf-publication`: Generate and verify a publication PDF from the Markdown vault with the approved rulebook scope and hierarchy.

### Modified Capabilities

- None.

## Impact

- Affected content: `vault/rules/`, `vault/index.md`, `vault/_sidebar.md`, and supporting assets.
- Affected tooling: the existing conversion utility will be replaced or extended, and package scripts will gain conversion, coverage, and PDF-publication commands.
- New local tooling dependencies are expected for LaTeX parsing/conversion and PDF generation; no Foundry-specific or end-to-end-test tooling is introduced.

## Validation Impact

- Compare the conversion manifest against every relevant entry in `NennekeV2.zip` and review all declared exclusions.
- Run `npm run validate:links` after navigation and Markdown changes and `npm run validate:orphans` after source-driven file moves or additions.
- Validate the generated PDF's title material, table of contents, chapter order, page count range, tables, quotations, images, and final-page legibility against `NennekeV6_3_1.pdf`.
