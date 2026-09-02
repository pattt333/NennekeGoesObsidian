## Context

Pandoc converts ordinary Markdown tables to Typst tables. The current PDF typography defines spacing and headings, while the special health-segment filter already defines its own table stroke. Ordinary tables therefore need a global PDF-only default.

## Goals / Non-Goals

**Goals:**

- Make every row and column boundary visible in the PDF.
- Keep rules thin and neutral so dense tables remain readable.
- Preserve explicit table styling supplied by specialised filters.

**Non-Goals:**

- Alter table Markdown, column widths, or cell contents.
- Change Obsidian or Docsify table rendering.
- Replace the health-segment table filter.

## Decisions

### Configure a Typst table default

The PDF typography filter will set a thin grey `stroke` on every Typst table. Typst applies this stroke around every cell, producing horizontal and vertical separators for Pandoc-generated tables.

This is preferred to rewriting every table in Lua because it is global, applies to future tables automatically, and leaves Markdown source untouched. The health-segment filter has an explicit stroke and therefore retains its existing colour-compatible grid.

## Risks / Trade-offs

- [Very large tables can appear busier] → Use a thin, muted grey stroke rather than a heavy black border.
- [Special table styling could be overridden] → Keep explicit table strokes authoritative and visually inspect the health table.

## Validation Strategy

- Render a regular two-column table and a multi-column rules table.
- Render the health-segment table to confirm fills and grid remain legible.
- Run the standard rulebook validators and PDF build.
