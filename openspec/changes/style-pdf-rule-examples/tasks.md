## 1. PDF styling

- [x] 1.1 Add a Typst show rule for Markdown block quotes to the PDF build.
- [x] 1.2 Correct the Grion example's visible line-break marker without overwriting unrelated user edits.

## 2. Validation and handoff

- [x] 2.1 Run the PDF build and inspect representative quote pages visually.
- [x] 2.2 Run `npm run rulebook:test`, `npm run validate:metadata`, `npm run validate:links`, and `npm run validate:orphans`.
- [x] 2.3 Validate the OpenSpec change, review the scoped diff, and automatically commit only task-scoped changes.
