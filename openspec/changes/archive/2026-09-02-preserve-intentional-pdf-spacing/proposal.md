## Why

Authors use additional blank lines in Markdown to deliberately separate adjacent rule paragraphs. Pandoc collapses every run of blank lines to one paragraph boundary, so the generated PDF currently loses that editorial distinction.

## What Changes

- Preserve every blank line beyond the normal paragraph separator as additional PDF-only vertical space.
- Apply the behavior automatically to existing and future source notes without modifying the vault files.
- Document the authoring convention in German.

## Capabilities

### New Capabilities

- `intentional-pdf-whitespace`: The PDF publication build retains deliberate additional Markdown blank lines as visible spacing.

### Modified Capabilities

- `readable-rulebook-pdf-typography`: The PDF typography contract also preserves author-defined extra vertical spacing.

## Impact

- Affects the aggregate Markdown preparation in `scripts/rulebook-tools.js` and the German authoring guide.
- No navigation, wikilinks, Docsify rendering, or vault content paths change.

## Validation Impact

- Add focused tool self-tests for normal and repeated blank-line runs.
- Validate generated Markdown, build the PDF, and visually inspect representative repeated-spacing content.
