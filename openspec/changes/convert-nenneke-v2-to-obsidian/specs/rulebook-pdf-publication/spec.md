## ADDED Requirements

### Requirement: Reproducible PDF publication

The system SHALL provide a documented command that builds a PDF from the approved Markdown publication manifest using declared project dependencies and writes it to a stable output location.

#### Scenario: Build the approved rulebook PDF

- **WHEN** the publication command is run in a prepared project environment
- **THEN** it creates the configured PDF from the ordered Markdown publication manifest

#### Scenario: Rebuild from a clean workspace

- **WHEN** the publication command is run after removing prior generated output
- **THEN** it produces the same chapter scope and publication structure without relying on a manually edited PDF

### Requirement: Reference publication hierarchy

The generated PDF SHALL contain title material, a table of contents, and chapters 1 through 9 in the order of the active `main.tex` include tree, matching the hierarchy of `NennekeV6_3_1.pdf`.

#### Scenario: Inspect the generated table of contents

- **WHEN** the generated PDF is opened
- **THEN** its table of contents lists chapters 1 through 9 in source order and provides page references

#### Scenario: Exclude supplementary source content

- **WHEN** the initial PDF is generated
- **THEN** Appendix A, spells, and liturgies are not included in the PDF body or table of contents

### Requirement: PDF visual acceptance

The publication workflow SHALL render the generated PDF for visual review and SHALL record review of title page, table of contents, chapter boundaries, tables, quotations, images, and the final page.

#### Scenario: Verify a table-heavy page

- **WHEN** a generated PDF includes a converted rule table
- **THEN** the rendered page shows readable cells with no clipped, overlapping, or missing content

#### Scenario: Verify a chapter boundary

- **WHEN** a generated PDF begins a new chapter
- **THEN** the chapter heading and page transition are readable and consistent with the approved publication hierarchy
