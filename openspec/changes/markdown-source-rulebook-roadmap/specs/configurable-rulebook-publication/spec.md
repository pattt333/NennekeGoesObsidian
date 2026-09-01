## ADDED Requirements

### Requirement: Source-managed PDF include tree
The repository SHALL define PDF build configuration in a versioned `book.yaml` and define PDF input order through a dedicated Markdown build entry tree. Recursive Obsidian embeds (`![[...]]`) SHALL include files; normal links SHALL remain cross-references.

#### Scenario: Maintainer selects a spell for publication
- **WHEN** the spell is embedded in the build entry tree
- **THEN** the next PDF build includes it in that position without including unrelated spell notes.

#### Scenario: Rule note is not selected
- **WHEN** a spell or liturgy exists in the vault but is absent from the build entry tree
- **THEN** it remains available in the vault and is excluded from the PDF.

### Requirement: Recursive include resolution
The PDF build SHALL recursively resolve build embeds, preserve their declared order, and fail with a clear error for missing targets, duplicate inclusion, or include cycles.

#### Scenario: Nested chapter structure
- **WHEN** a chapter build index embeds child rule notes and a nested maneuver index
- **THEN** the resolver produces each included note once in depth-first declared order.

#### Scenario: Include cycle
- **WHEN** build embeds form a cycle
- **THEN** the build stops before PDF generation and reports the include chain.
