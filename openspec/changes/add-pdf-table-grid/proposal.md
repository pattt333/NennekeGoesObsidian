## Why

The generated PDF currently renders ordinary Markdown tables with only limited rules, making rows and columns harder to follow. Readers need every table cell clearly delineated.

## What Changes

- Apply a complete, subtle grid to every table in the PDF.
- Preserve the existing coloured health-segment table styling.
- Document that Markdown tables receive this PDF-only treatment automatically.

## Capabilities

### New Capabilities

- `pdf-table-presentation`: The generated PDF renders every Markdown table with visible row and column separators.

### Modified Capabilities

- None.

## Impact

- Affects the global PDF Typst styling and the German Markdown authoring guide.
- Markdown tables, Obsidian, Docsify, wikilinks, and vault navigation remain unchanged.

## Validation Impact

- Build and visually inspect a standard table and the coloured health-segment table.
- Run the rulebook tool, metadata, link, and orphan validation.
