## ADDED Requirements

### Requirement: Vault-local shared Obsidian setup
The repository SHALL provide a minimal shared configuration under `vault/.obsidian/` that enables the built-in reader navigation features: file explorer, global search, Quick Switcher, Outline, Backlinks, Page Preview, and Bookmarks. Personal workspace and graph state in that directory SHALL be ignored.

#### Scenario: Reader opens the rulebook directory
- **WHEN** a reader selects `vault/` as an Obsidian vault
- **THEN** the rulebook files are the visible workspace and the shared reader navigation features are available without contributor tooling folders

### Requirement: German reader setup guide
The root README SHALL explain in German how to open `vault/` in Obsidian, begin at the generated start page, use search and the Outline, create personal bookmarks, and optionally start the Docsify web view.

#### Scenario: New reader sets up the rulebook
- **WHEN** a German-speaking reader follows the README
- **THEN** they can open and navigate the rulebook without needing to understand the conversion pipeline or repository tooling
