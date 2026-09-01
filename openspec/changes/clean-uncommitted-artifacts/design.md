## Context

The completed Nenneke conversion leaves two classes of untracked root artifacts: the required LaTeX input archive and dispensable local leftovers. The conversion pipeline loads `NennekeV2.zip` from the repository root and verifies it against the committed inventory checksum. `NennekeV6_3_1.pdf` served only as a visual-review reference; the maintained publication output is generated from the vault under the ignored `output/` directory.

Personal `.obsidian` state and tracked files that Git marks modified without a content diff are outside this cleanup. They are not repository artifacts to normalize or commit.

## Goals / Non-Goals

**Goals:**

- Retain a reproducible conversion input in the expected location.
- Remove unrelated, empty, obsolete, and generated untracked artifacts.
- Prevent routine Python execution from recreating untracked bytecode cache directories.
- Make the conversion documentation accurately distinguish the completed visual comparison from a required local reference asset.

**Non-Goals:**

- Change vault content, wikilinks, navigation, Docsify behavior, deployment files, or generated publication output.
- Remove or commit personal Obsidian workspace state.
- Move, rename, or replace `NennekeV2.zip`.
- Re-run the complete conversion or reproduce the historical V6.3.1 visual comparison.

## Decisions

### Keep the ZIP as a controlled local source input

`NennekeV2.zip` remains at the root because the pipeline consumes it directly and the committed checksum/inventory only identifies, rather than preserves, its contents. This keeps a future regeneration and source-coverage check possible.

Alternative considered: remove the archive after conversion. This would make the Markdown output the only local source and prevent reproducible source-backed conversion.

### Treat the V6 PDF as a completed-review reference, not a runtime dependency

Remove the untracked reference PDF and revise the documentation to record that the comparison occurred. Publication remains reproducible from Markdown; the generated PDF is already an ignored build output.

Alternative considered: retain the PDF indefinitely. It has no build-time or reader-facing role and would keep a large untracked binary in the root.

### Delete only explicitly classified artifacts

Remove the empty canvas, unrelated Foundry plan, and bytecode cache. Add a targeted `__pycache__/` ignore rule. Do not alter `.obsidian` files or touch vault files with no content diff.

Alternative considered: reset every uncommitted entry. That could discard a maintainer's personal state or pending work.

## Content and Link Impact

No vault notes, wikilinks, sidebar paths, or Docsify routes are removed, moved, or renamed. The documentation revision does not change a navigation target, so no redirect or link migration is required.

## Validation Strategy

- Run `npm run validate:links` after updating the conversion documentation.
- Run the source inventory/validation command to confirm that the retained ZIP remains available and matches the recorded inventory.
- Confirm the removed artifacts are absent, `__pycache__/` is ignored, and the scoped diff excludes `.obsidian` state and content-equivalent vault entries.

## Migration Plan

1. Delete only the classified dispensable artifacts.
2. Add the cache ignore rule and update the historical-reference wording.
3. Validate documentation links and the source input, then commit the scoped change.
4. If the reference PDF is later needed, restore it from the original external source; no repository path or user-facing link depends on it.

## Risks / Trade-offs

- [The V6.3.1 PDF may be needed for another visual comparison] → Its prior review remains recorded; obtain a fresh copy from the original source when a new comparison is necessary.
- [A future conversion cannot locate the ZIP] → Validate the source input before committing and retain its existing root path.
- [Cleanup captures personal work] → Stage only the explicit artifact paths and documentation/ignore-rule changes.
