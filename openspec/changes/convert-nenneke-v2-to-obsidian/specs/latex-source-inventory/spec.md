## ADDED Requirements

### Requirement: Archive inventory and identity

The system SHALL treat `NennekeV2.zip` as the authoritative conversion input and SHALL generate a machine-readable inventory containing its SHA-256 checksum, every archive entry, file type, size, include relationships, and source classification.

#### Scenario: Inventory a supplied archive

- **WHEN** the conversion inventory command is run against `NennekeV2.zip`
- **THEN** it records the archive checksum and every entry without modifying the archive

#### Scenario: Discover the publication tree

- **WHEN** the inventory resolves `main.tex`
- **THEN** it records active includes separately from commented-out includes and identifies the ordered chapter hierarchy

### Requirement: Source coverage manifest

The system SHALL assign every non-empty LaTeX source entry one manifest disposition of `converted`, `structural`, `generated`, or `excluded`, and SHALL require a reason for every excluded entry.

#### Scenario: Account for every source file

- **WHEN** the conversion manifest is generated
- **THEN** its accounted source-file total equals the number of non-empty relevant LaTeX entries in the archive

#### Scenario: Identify stale vault files

- **WHEN** a Markdown file has no source mapping
- **THEN** the migration report classifies it as mapped, migrated, historical, or obsolete without deleting it

### Requirement: Initial PDF publication scope

The system SHALL record the initial PDF publication scope as the title material, table of contents, and the active chapters 1 through 9 from `main.tex`, while Appendix A, spells, and liturgies remain outside that output.

#### Scenario: Check the approved scope

- **WHEN** the PDF assembly manifest is generated
- **THEN** it includes each active chapter from `main.tex` in source order and excludes the commented appendix, spell, and liturgy entries
