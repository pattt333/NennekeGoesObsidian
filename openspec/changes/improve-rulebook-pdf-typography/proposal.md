## Why

The generated rulebook PDF is correct, but its text is visually dense: headings have too little separation from surrounding prose and ordinary paragraphs and lists run together. The first rendered book page must also start after the automatically generated table of contents.

## What Changes

- Add a PDF-only Typst typography layer for clearer paragraph, heading, and list spacing.
- Insert a PDF-only page break between the generated table of contents and the rulebook's opening title.
- Keep Markdown source and Obsidian rendering unchanged.

## Capabilities

### New Capabilities

- `readable-rulebook-pdf-typography`: The PDF build applies a readable, consistent vertical rhythm without changing the vault's Markdown presentation.

### Modified Capabilities

- None.

## Impact

- Affects `scripts/rulebook-tools.js` and a new PDF-only Pandoc/Typst filter.
- Regenerates `build/Nenneke.md` and `build/Nenneke.pdf` locally during validation; these build outputs remain untracked.
