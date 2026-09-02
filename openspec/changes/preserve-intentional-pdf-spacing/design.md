## Context

Markdown recognizes one or more blank lines as a paragraph boundary. Pandoc's parsed document tree therefore cannot tell whether the author wrote one blank line or several. The distinction must be preserved before Pandoc parses the generated aggregate Markdown.

## Goals / Non-Goals

**Goals:**

- Give each blank line after the first in a contiguous run a visible PDF-only vertical gap.
- Apply this consistently to all build-included Markdown notes.
- Keep one normal paragraph separator unchanged.

**Non-Goals:**

- Change Obsidian or Docsify rendering.
- Rewrite source Markdown or normalize its whitespace.
- Interpret blank lines inside fenced code blocks as layout instructions.

## Decisions

### Preserve spacing while assembling the PDF input

The PDF builder will transform repeated blank-line runs after frontmatter and build-only embeds are removed, but before the aggregate Markdown is written. It keeps the first blank line as the standard Markdown paragraph separator and inserts one raw Typst vertical spacer for each additional blank line.

This is preferred to a Pandoc Lua filter because Pandoc has already discarded the original count of blank lines by that stage.

### Keep fenced code literal

The transformation will track fenced code blocks and leave their contents untouched, so formatting examples and code remain exact.

### Document the convention

The German authoring guide will define one blank line as an ordinary paragraph break and each additional blank line as intentional extra PDF separation.

## Risks / Trade-offs

- [Historic repeated blank lines produce more breathing room than expected] → Apply the behavior uniformly, visually inspect representative pages, and let authors remove only spacing they no longer want.
- [Raw Typst spacing leaks into non-PDF views] → Insert it solely in generated `build/Nenneke.md`, never into vault files.

## Validation Strategy

- Self-test ordinary paragraph breaks, repeated blank lines, and fenced-code preservation.
- Build the book and visually inspect the Eigenschaften section and a representative ordinary page.
- Run the existing metadata, link, and orphan validators.
