## Context

The conversion pipeline currently generates a chapter-only `index.md` and a `_sidebar.md` that appends every mapped source note beneath `Alle Quellnotizen`. Notes contain child links where the LaTeX source includes other files, but do not provide a consistent route back to their parent or across sibling notes. The repository-root `.obsidian` directory makes the repository, rather than the `vault/` rulebook, the default Obsidian workspace.

The source archive remains authoritative and `index.md`/`_sidebar.md` are overwritten by regeneration. Reader navigation must therefore be generated from the archive include graph rather than maintained as a second body of rule content.

## Goals / Non-Goals

**Goals:**

- Make `vault/` directly openable as a focused Obsidian rulebook.
- Make the generated home page and Docsify sidebar useful for reading rather than source inventory browsing.
- Provide reversible parent and sibling navigation from the same source mapping used by conversion.
- Document the reader setup and everyday navigation in German.

**Non-Goals:**

- Rewrite rule prose, rename source-derived files, or alter the LaTeX conversion scope.
- Convert all standard Markdown links to wikilinks; standard relative Markdown links already work in Obsidian and are required by Docsify.
- Add community plugins, an Obsidian Sync configuration, or end-to-end tests.
- Commit personal workspace, graph, or bookmark state.

## Decisions

### Seed a minimal vault-local Obsidian configuration

Create `vault/.obsidian/` with only shared, reader-relevant defaults: file explorer, global search, Quick Switcher, Outline, Backlinks, Page Preview, and Bookmarks. Ignore workspace, graph, and device-specific state under this directory. Leave the existing root `.obsidian` directory untouched so current maintainers do not lose local state.

Alternative considered: move the root `.obsidian` directory. That would mix tracked defaults with an already-modified personal workspace and risks disrupting the current local setup.

### Generate a compact reading map from the include graph

The generated home page will retain the ordered chapter spine and add a short `Am Spieltisch` lookup section using stable source-mapped destinations for the most common reader routes. The Docsify sidebar will render the chapter hierarchy and selected section-level children, not an exhaustive flat list of all source files. The source tree remains available through Obsidian search and the file explorer.

Alternative considered: retain `Alle Quellnotizen` in the sidebar. A 600-plus-entry flat listing is an inventory, not practical rulebook navigation.

### Generate local navigation on source-derived notes

Build parent/child and sibling relationships from the archive include graph. A note that is included by another mapped source gets a compact navigation block with its parent and adjacent sibling notes. Generated relative Markdown links are used for both Obsidian and Docsify compatibility.

Alternative considered: hand-author a separate navigation layer. It would drift when the ZIP source changes and conflict with the source-authoritative workflow.

### Use the root README as the German reader entry guide

Replace the repository README with a concise German guide for obtaining the vault, opening `vault/` in Obsidian, navigating from the start page, and optionally viewing Docsify. Contributor and conversion details remain in `docs/`.

Alternative considered: restore `vault/README.md`. Docsify uses `index.md` as its home page and a root README better serves people before they open the vault.

## Content and Link Impact

`vault/index.md`, `vault/_sidebar.md`, and source-derived notes gain regenerated navigation links; no existing note path is renamed or removed. Current standard Markdown links remain valid, so no redirect or wikilink migration is needed. The removal of the exhaustive sidebar list changes only menu discoverability; every note remains reachable through its chapter hierarchy, folder tree, or search.

## Validation Strategy

- Extend focused pipeline tests for home-page, sidebar, and source-note navigation generation.
- Run `npm run nenneke:test` and `npm run nenneke:validate` after regenerating navigation.
- Run `npm run validate:links` and `npm run validate:orphans`.
- Serve Docsify and inspect the home page, compact sidebar, a chapter, and a nested note.
- Inspect the vault-local Obsidian defaults and German README; verify personal state files are ignored and unstaged.

## Migration Plan

1. Add vault-local shared configuration without moving or deleting root personal-state files.
2. Update the generator, regenerate staging output, and apply the approved navigation files.
3. Validate links, reachability, and Docsify presentation before committing.
4. If navigation regresses, revert the commit and rerun the preceding generator; no note paths require redirects.

## Risks / Trade-offs

- [A compact sidebar hides a rarely used source note] → Preserve chapter hierarchy and rely on Obsidian search/file explorer for complete discovery.
- [Generated navigation links are incorrect] → Derive all destinations from the existing source map and enforce pipeline/link validation.
- [Vault-local settings are mistaken for personal state] → Track only shared defaults; explicitly ignore workspace and graph files.
