## Context

The completed V2 conversion intentionally retained historical Markdown in `vault/.migration/legacy-markdown/` while its ownership was decided. The user has now decided that the archive is the only content authority: old Schicksalspunkte, Kampfvorteile, spell, initiative, and `08_profanes` notes are obsolete. The vault also contains a zero-tag index and a stale README; repository documentation still includes Discord-era instructions and paths removed by the conversion.

## Goals / Non-Goals

**Goals:**

- Leave the published vault with source-derived rules and assets plus only the infrastructure required to open and navigate it.
- Prevent retired tag-index and README files from being regenerated or treated as navigation hubs.
- Keep maintainer and contributor guidance accurate without removing deployment options that are still documented and referenced.

**Non-Goals:**

- Change rule content derived from `NennekeV2.zip`.
- Add redirects or preserve alternate reader-facing URLs for explicitly retired historical notes.
- Remove the V2 inventory, manifest, conversion pipeline, PDF workflow, Caddy configuration, or nginx configuration.
- Modify personal Obsidian settings, canvas files, supplied source/reference binaries, or unrelated local edits.

## Decisions

### 1. Retire all legacy migration content

Delete every file under `vault/.migration/legacy-markdown/`. The user has classified every retained item as obsolete, so retaining a separate historical copy would contradict the archive-only content policy.

Alternative considered: retain selected notes as house rules. Rejected because the user explicitly chose source-only vault content.

### 2. Remove non-source vault support notes that have no active purpose

Delete `vault/00-Tag-Index.md` and `vault/README.md`. The tag index contains no tags and is deliberately excluded from orphan checks; the README is stale and points to retired content. Keep `vault/index.md`, `vault/_sidebar.md`, and `vault/index.html` because Docsify and readers use them as entry infrastructure.

Remove `scripts/create-tag-index.js` and its maintenance documentation so the retired tag-index output cannot be recreated. Update the orphan checker to use only the maintained entry points as hubs.

Alternative considered: regenerate the tag index. Rejected because it creates non-source vault content and the converted vault has no tag taxonomy.

### 3. Consolidate current contributor documentation

Delete `docs/WORKFLOW.md`, whose Git/Discord procedure overlaps the setup guide and references retired content. Keep and revise `docs/OBSIDIAN_SETUP_GUIDE.md` and `docs/MAINTENANCE.md` to describe the maintained workflow and checks without Discord or tag-index references. Preserve `docs/DEPLOYMENT.md`, `docs/Caddyfile`, and `docs/nginx.conf` as the supported deployment path and alternatives.

Alternative considered: retain the workflow file with corrections. Rejected because it duplicates the setup guide and creates two sources of contributor procedure.

## Content and Link Impact

- Removed paths receive no redirect: all retired vault notes are intentionally obsolete and must have no links from the active index or sidebar.
- The orphan checker will start only at `index.md` and `_sidebar.md`; it will no longer rely on the deleted README or special-case the tag-index filename.
- Documentation links and examples will no longer reference `rules/combat/initiative`, `rules/02_Schicksalspunkte`, `notes/`, Discord, or `create-tag-index.js`.

## Risks / Trade-offs

- [A historical note contains content a reader still values] → The decision is recorded in this proposal and the prior conversion commit preserves recovery through Git history.
- [A deleted path remains referenced] → Search all repository references, run the vault link/orphan validators, and preview Docsify before committing.
- [Removing the tag generator surprises a maintainer] → State the archive-only vault policy in the maintained documentation and retain the conversion inventory as the authoritative audit trail.

## Migration Plan

1. Verify that the active vault navigation does not require any retirement candidate.
2. Remove legacy migration content, the stale tag index and README, and the retired tag-generator script.
3. Update orphan-check hub assumptions and contributor documentation.
4. Run content/link validation and a Docsify preview.
5. Review the scoped deletion diff and commit only the validated cleanup.

Rollback consists of reverting the cleanup commit; no source archive or generated V2 content is modified.

## Open Questions

- None. The user has decided that the vault contains only archive-derived content and required navigation infrastructure.
