## 1. Obsidian reader setup

- [x] 1.1 Add minimal shared Obsidian defaults under `vault/.obsidian/` for file exploration, search, Quick Switcher, Outline, Backlinks, Page Preview, and Bookmarks without moving root personal state.
- [x] 1.2 Ignore vault-local workspace, graph, and device-specific Obsidian state while retaining only the shared defaults.
- [x] 1.3 Replace the root README with a concise German guide for opening `vault/`, starting the rulebook, using Obsidian navigation, and optionally serving Docsify.

## 2. Generated reader navigation

- [x] 2.1 Extend the conversion pipeline to derive parent, child, and sibling navigation from the source include graph and source map.
- [x] 2.2 Generate a reader-first `index.md` with the ordered chapter spine and concise German `Am Spieltisch` lookup routes.
- [x] 2.3 Generate a compact hierarchical `_sidebar.md` without the exhaustive `Alle Quellnotizen` inventory.
- [x] 2.4 Render parent and available previous/next sibling links on eligible source-derived notes using Markdown paths valid in both Obsidian and Docsify.
- [x] 2.5 Add or update focused pipeline tests for the generated home page, sidebar, and local note navigation.
- [x] 2.6 Regenerate and apply the approved source-derived navigation output to the vault.

## 3. Validation and handoff

- [x] 3.1 Run `npm run nenneke:test` and `npm run nenneke:validate` with the configured project Python runtime.
- [x] 3.2 Run `npm run validate:links` and `npm run validate:orphans`, resolving any navigation regressions.
- [x] 3.3 Serve Docsify and manually verify the German home page, compact sidebar, a chapter route, and a nested note route.
- [x] 3.4 Verify the vault-local Obsidian defaults and README protect personal workspace state while enabling the documented reader features.
- [x] 3.5 Run `openspec validate "reader-first-obsidian-navigation" --strict`, review the scoped diff, and automatically commit the validated change with a concise Conventional Commit message.
