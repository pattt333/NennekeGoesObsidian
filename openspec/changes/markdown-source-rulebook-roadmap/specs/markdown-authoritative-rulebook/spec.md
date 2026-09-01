## ADDED Requirements

### Requirement: Markdown-only rulebook source
The repository SHALL maintain rule content directly in versioned Markdown and SHALL not require a LaTeX ZIP archive or conversion pipeline to edit, validate, publish, or navigate the rulebook.

#### Scenario: Maintainer edits a rule
- **WHEN** a maintainer changes a rule note in the vault
- **THEN** the edit remains authoritative after validation and is not overwritten by a source conversion step.

#### Scenario: Archive retirement
- **WHEN** the Markdown completeness audit passes
- **THEN** the ZIP archive and its conversion workflow are removed from the active repository workflow.
