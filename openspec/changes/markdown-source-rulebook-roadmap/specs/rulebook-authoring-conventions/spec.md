## ADDED Requirements

### Requirement: Documented portable Markdown convention
The repository SHALL document concise German conventions for headings, tables, rule boxes, examples, formulas, links, metadata, and source-managed assets.

#### Scenario: Contributor creates a rule note
- **WHEN** a contributor consults the authoring guide
- **THEN** they can create supported rulebook structures without relying on LaTeX-specific syntax.

### Requirement: Relative Markdown link validation
The repository SHALL validate published relative Markdown links as well as any supported Obsidian-specific links.

#### Scenario: Contributor adds a broken published link
- **WHEN** a validation command runs after the link is added
- **THEN** it reports the broken target.
