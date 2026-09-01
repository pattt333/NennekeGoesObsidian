## ADDED Requirements

### Requirement: Reader-first home page
The generated rulebook home page SHALL present the source publication's ordered chapter spine and a concise German `Am Spieltisch` section for frequent rule lookups, using destinations from the source-to-Markdown map.

#### Scenario: Reader starts a rulebook session
- **WHEN** a reader opens `vault/index.md`
- **THEN** they can select an ordered chapter or a frequent lookup route without browsing raw source filenames

### Requirement: Compact hierarchical Docsify sidebar
The generated Docsify sidebar SHALL expose the start page, publication chapters, and section-level hierarchy without an exhaustive flat `Alle Quellnotizen` inventory.

#### Scenario: Reader opens the website navigation
- **WHEN** a reader views the Docsify sidebar
- **THEN** they can reach chapter and section pages through a compact hierarchy and are not presented with every source note as one flat menu

### Requirement: Generated local rule navigation
For each mapped source note with a mapped parent or mapped siblings in the LaTeX include graph, the generated Markdown SHALL provide links to the parent and available adjacent siblings using paths that resolve in both Obsidian and Docsify.

#### Scenario: Reader follows a nested combat rule
- **WHEN** a reader opens a nested rule note such as a combat maneuver group
- **THEN** they can navigate back to its parent and to its available previous or next sibling without using the file explorer
