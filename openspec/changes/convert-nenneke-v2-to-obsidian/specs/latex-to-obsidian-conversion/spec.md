## ADDED Requirements

### Requirement: Faithful rule content conversion

The system SHALL convert authoritative LaTeX prose, chapter and section hierarchy, lists, tables, quotations, emphasis, labels, and supported images into readable Markdown without retaining stale text from the prior conversion.

#### Scenario: Convert a chapter with mixed rulebook structures

- **WHEN** a source chapter contains prose, headings, a table, an ordered list, and a quotation
- **THEN** the corresponding Markdown preserves each structure and its reading order

#### Scenario: Detect unsupported source syntax

- **WHEN** the converter encounters a LaTeX construct without a defined transformation
- **THEN** it reports the source path and construct instead of silently dropping its content

### Requirement: Source-derived Markdown layout

The system SHALL create stable Markdown destinations and source mappings for converted content, with chapter entry notes and child-note navigation derived from the source include tree.

#### Scenario: Convert nested source files

- **WHEN** a chapter includes child source files
- **THEN** the manifest records each child mapping and the chapter entry note links to the resulting child notes in source order

#### Scenario: Migrate the source chapter structure

- **WHEN** the conversion replaces a current vault area whose name differs from the source area
- **THEN** it records the old-to-new path mapping and updates approved navigation references

### Requirement: Obsidian and Docsify link integrity

The system SHALL convert source labels and internal references into stable Markdown anchors or links and SHALL generate valid vault navigation.

#### Scenario: Resolve a source internal reference

- **WHEN** converted source content references a known source label
- **THEN** the Markdown link resolves to the mapped note or heading anchor

#### Scenario: Validate generated navigation

- **WHEN** the generated vault layout and navigation are complete
- **THEN** the link validator reports no newly introduced broken links

### Requirement: Existing content migration safeguards

The system SHALL not silently overwrite or delete existing Markdown-only content; it SHALL include every such file in a migration report before the source-derived vault is finalized.

#### Scenario: Preserve an unmatched existing note for review

- **WHEN** an existing Markdown note has no source mapping
- **THEN** the conversion output identifies the note and leaves it available for classification before final replacement
