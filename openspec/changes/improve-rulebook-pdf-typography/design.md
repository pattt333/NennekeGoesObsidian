## Context

The vault's Markdown is used both by Obsidian and the PDF pipeline. Visual changes for the printed rulebook must therefore be applied in the Pandoc-to-Typst path rather than by modifying source notes.

## Decisions

### PDF-only typography filter

Add `scripts/pdf-typography.lua` and load it during the PDF build. It injects Typst defaults for paragraph leading and spacing, heading margins, and list margins. This keeps the reading rhythm consistent across every included note while leaving Obsidian untouched.

### Table-of-contents boundary

Prepend a raw Typst `#pagebreak()` block to the generated aggregate Markdown. Pandoc generates its table of contents before document content, so the break falls immediately before `# Nenneke` and prevents the opening chapter from continuing on the contents page.

### Scope

The change deliberately does not alter font families, paper size, margins, rule content, or the existing styles for rule-example blockquotes and health tables.

## Validation

- Run the rulebook tool self-test and metadata, link, and orphan validators.
- Build the PDF.
- Render representative pages and visually confirm the table-of-contents transition and the improved spacing in prose, headings, and lists.
