## 1. Retirement audit

- [x] 1.1 Confirm that every file in `vault/.migration/legacy-markdown/` is explicitly classified as obsolete and that active vault navigation does not require it.
- [x] 1.2 Identify every repository reference to the retired tag index, stale README, Discord guidance, and deleted rule paths.

## 2. Source-authoritative vault cleanup

- [x] 2.1 Remove all legacy migration Markdown, `vault/00-Tag-Index.md`, and `vault/README.md` without modifying source-derived rules, assets, or required vault entry files.
- [x] 2.2 Remove the retired tag-index generator and update the orphan checker so its maintained hubs are `index.md` and `_sidebar.md` only.
- [x] 2.3 Verify that the active index and sidebar contain no retired paths and that no redirect is required for intentionally obsolete notes.

## 3. Current documentation

- [x] 3.1 Remove `docs/WORKFLOW.md` and eliminate Discord, retired-path, and tag-index references from maintained contributor and maintenance documentation.
- [x] 3.2 Preserve and verify the Caddy and nginx deployment guidance while updating any affected cross-references.

## 4. Validation and handoff

- [x] 4.1 Run `npm run validate:links` and resolve all newly introduced broken links.
- [x] 4.2 Run `npm run validate:orphans` and confirm the reduced hub set reaches every active vault note.
- [x] 4.3 Preview the Docsify home page and representative chapter navigation after the retirement.
- [x] 4.4 Run `openspec validate "remove-stale-vault-and-doc-files" --strict` and resolve validation errors.
- [x] 4.5 Review the scoped deletion diff, confirm personal Obsidian files and unrelated local edits are excluded, and automatically commit the validated cleanup with a concise Conventional Commit message.
