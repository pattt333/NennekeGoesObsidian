## ADDED Requirements

### Requirement: Distinct PDF rule examples
The PDF build SHALL render every Markdown block quote as a visually distinct, breakable rule-example block with a subtle left border and background.

#### Scenario: Rule example in a chapter
- **WHEN** a published rule note contains a Markdown block quote
- **THEN** the generated PDF displays it separately from surrounding prose without rendering the `>` marker.

#### Scenario: Obsidian source
- **WHEN** a reader opens the same note in Obsidian
- **THEN** the source remains a standard Markdown block quote.
