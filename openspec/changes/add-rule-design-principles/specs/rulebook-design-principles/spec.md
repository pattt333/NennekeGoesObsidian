## ADDED Requirements

### Requirement: Overall rulebook design orientation
The generated rulebook SHALL provide a reader-facing page containing the supplied overarching rule design principles and SHALL link to it before the numbered chapters from the generated start page and sidebar.

#### Scenario: Reader starts the rulebook
- **WHEN** a reader opens the generated start page or sidebar
- **THEN** they can open the overall design-principles page before selecting a numbered rule chapter.

### Requirement: Chapter-specific design principles
The generation pipeline SHALL insert supplied chapter-specific design principles immediately after the H1 of their corresponding generated chapter notes.

#### Scenario: Reader opens a chapter with supplied principles
- **WHEN** a reader opens a chapter for which an editorial principle source exists
- **THEN** a `Designprinzipien` section appears before the ZIP-derived rule content.

#### Scenario: Reader opens a chapter without supplied principles
- **WHEN** a reader opens a chapter for which no editorial principle source exists
- **THEN** the chapter retains its ZIP-derived content without an invented placeholder section.

### Requirement: Regeneration-safe editorial source
The overall and chapter-specific principles SHALL be stored outside generated vault output and be reapplied by the conversion pipeline on every regeneration.

#### Scenario: Maintainer regenerates the rulebook
- **WHEN** the maintainer runs the conversion and apply commands
- **THEN** the generated overview and all available chapter-specific principles remain present in the vault.
