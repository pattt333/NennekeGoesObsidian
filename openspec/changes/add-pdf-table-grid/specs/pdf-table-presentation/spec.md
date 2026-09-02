## ADDED Requirements

### Requirement: Complete PDF table grid

The PDF build SHALL render every Markdown table with visible horizontal and vertical cell separators.

#### Scenario: Reading a standard Markdown table

- **WHEN** a rule note contains a Markdown table included in the book
- **THEN** every row and column boundary is visible in the generated PDF
- **AND** the table's Markdown source remains unchanged

#### Scenario: Rendering the health-segment table

- **WHEN** the coloured health-segment table is included in the PDF
- **THEN** its colour coding remains visible
- **AND** its complete grid remains legible
