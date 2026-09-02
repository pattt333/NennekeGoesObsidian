## Requirements

### Requirement: PDF-only readable vertical rhythm

The PDF build SHALL apply globally consistent vertical spacing for paragraphs, headings, and lists without changing the Markdown appearance in Obsidian. It SHALL preserve every author-defined blank line beyond a normal paragraph separator as additional PDF-only vertical spacing.

#### Scenario: Reading ordinary rulebook prose in the PDF

- **WHEN** a rulebook PDF is built from the vault
- **THEN** consecutive paragraphs, headings, and lists have visually distinct spacing
- **AND** author-defined additional blank lines appear as additional vertical separation
- **AND** the source Markdown files remain unchanged by the typography step

### Requirement: Rulebook begins after the generated table of contents

The PDF build SHALL place a page boundary after the generated table of contents and before the opening rulebook title.

#### Scenario: Opening the generated PDF

- **WHEN** Pandoc generates a table of contents for the rulebook PDF
- **THEN** the opening title `Nenneke` begins on a later page than the final table-of-contents entry
