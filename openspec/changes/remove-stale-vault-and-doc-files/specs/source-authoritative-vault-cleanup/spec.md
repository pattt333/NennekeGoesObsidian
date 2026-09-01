## ADDED Requirements

### Requirement: Archive-only published vault content
The published vault SHALL contain only content derived from the approved `NennekeV2.zip` archive, archive-derived assets, and the maintained navigation infrastructure required by Obsidian and Docsify.

#### Scenario: Retire legacy conversion notes
- **WHEN** the vault cleanup is applied
- **THEN** no file remains under `vault/.migration/legacy-markdown/`

#### Scenario: Retire stale auxiliary notes
- **WHEN** the vault cleanup is applied
- **THEN** `vault/00-Tag-Index.md` and `vault/README.md` are absent while `vault/index.md`, `vault/_sidebar.md`, and `vault/index.html` remain available

### Requirement: Active navigation excludes retired content
The maintained vault navigation and health checks SHALL not rely on retired migration notes, the stale README, or the retired tag index.

#### Scenario: Validate surviving vault navigation
- **WHEN** the cleanup validation commands are run
- **THEN** no active navigation link or orphan-check hub references a retired vault path

#### Scenario: Prevent tag-index regeneration
- **WHEN** a maintainer reviews the repository tooling after cleanup
- **THEN** no maintained script generates `vault/00-Tag-Index.md`
