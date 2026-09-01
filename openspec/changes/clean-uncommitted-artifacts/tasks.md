## 1. Classify and remove local artifacts

- [x] 1.1 Confirm that `NennekeV2.zip` is present at its configured root path and matches the committed conversion inventory.
- [x] 1.2 Remove the obsolete V6.3.1 reference PDF, empty canvas, unrelated Foundry restructuring plan, and generated Python bytecode caches.
- [x] 1.3 Add a targeted Python bytecode-cache ignore rule without broadening ignore coverage to source or vault content.

## 2. Maintain documentation

- [x] 2.1 Update the Nenneke conversion guide to record the historical visual comparison without requiring the removed local PDF.
- [x] 2.2 Confirm that the documentation change introduces no broken Markdown or vault links by running `npm run validate:links`.

## 3. Validation and handoff

- [x] 3.1 Run `npm run nenneke:validate` to verify that the retained source archive remains usable and matches the conversion inventory.
- [x] 3.2 Confirm removed artifacts are absent, Python caches are ignored, and personal `.obsidian` state plus content-equivalent vault worktree entries are not staged.
- [x] 3.3 Review the scoped diff and automatically commit the validated cleanup with a concise Conventional Commit message.
