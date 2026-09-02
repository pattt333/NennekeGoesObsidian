## ADDED Requirements

### Requirement: Preserve intentional extra blank lines in the PDF

The PDF build SHALL retain every blank line beyond the first blank line in a contiguous Markdown blank-line run as one additional visible vertical gap.

#### Scenario: Consecutive rule paragraphs have deliberate extra spacing

- **WHEN** an included Markdown note contains two or more consecutive blank lines between text blocks
- **THEN** the PDF renders the normal paragraph separation plus one additional gap for each further blank line
- **AND** the source note is not modified

#### Scenario: A normal paragraph break remains normal

- **WHEN** an included Markdown note contains exactly one blank line between text blocks
- **THEN** the PDF renders only the standard paragraph separation

#### Scenario: Fenced code stays literal

- **WHEN** consecutive blank lines occur inside a fenced code block
- **THEN** the PDF input preserves those lines without adding a Typst spacing instruction
