## 1. Editorial sources and generation

- [x] 1.1 Add the supplied overall and chapter-specific design-principle Markdown sources, without inventing a chapter 2 principle.
- [x] 1.2 Extend the conversion pipeline to generate the overview, inject available principles after chapter H1 headings, and link the overview from generated reader navigation.
- [x] 1.3 Add focused pipeline tests for the overview, chapter insertion, and absent chapter 2 principle.
- [x] 1.4 Regenerate and apply the source-derived vault output.

## 2. Validation and handoff

- [x] 2.1 Run `npm run nenneke:test`, `npm run nenneke:validate`, `npm run validate:links`, and `npm run validate:orphans`.
- [x] 2.2 Preview the updated Docsify start page and a chapter containing design principles.
- [x] 2.3 Run strict OpenSpec validation, review the scoped diff, and automatically commit the completed change.
