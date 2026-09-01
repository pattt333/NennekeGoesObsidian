## ADDED Requirements

### Requirement: Stable addressable rule IDs
Each addressable rule note SHALL have a unique YAML `id` that remains valid when its path or title changes.

#### Scenario: Rule note is renamed
- **WHEN** a note with a stable ID is renamed or moved
- **THEN** the same ID remains available for citations and external clients.

### Requirement: Section-level citation targets
The retrieval and publication metadata SHALL identify a note's heading-based section target; an explicit subsection ID is required only when a stable external target beyond the heading is needed.

#### Scenario: Client cites a rule section
- **WHEN** a client receives a rule citation
- **THEN** it can display the stable note ID together with the relevant heading and canonical link.
