## Why

The rulebook explains individual rules but not the shared design intentions that make those rules coherent. Readers need a concise orientation before the book and before the chapters that establish major subsystems.

## What Changes

- Add the supplied overarching design principles as a source-managed introductory rulebook note.
- Add the supplied chapter design principles directly below the chapter headings for chapters 1 and 3–9.
- Link the introduction before the chapters in the generated home page and sidebar.
- Extend the generation pipeline and tests so the editorial material survives ZIP-based regeneration and remains reachable in both Obsidian and Docsify.

## Capabilities

### New Capabilities

- `rulebook-design-principles`: Present source-managed overarching and chapter-specific design principles as part of the reader navigation.

### Modified Capabilities

- None.

## Impact

- Affected content: new editorial Markdown sources and generated vault pages.
- Affected tooling: `scripts/nenneke_v2_pipeline.py` and its focused tests.
- Affected navigation: generated `vault/index.md` and `vault/_sidebar.md`.

## Validation Impact

- Run pipeline tests, generation validation, link and orphan validation, strict OpenSpec validation, and inspect the updated Docsify start page and a chapter with principles.
