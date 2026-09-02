## 1. Nextcloud publication

- [x] 1.1 Add a secret-backed WebDAV upload of the release PDF as `Nenneke.pdf` after GitHub Release creation.
- [x] 1.2 Preserve the existing GitHub Release asset and prevent the upload from running for manual builds.

## 2. Documentation

- [x] 2.1 Document the required secret names and the stable Nextcloud filename in German without exposing credential values.

## 3. Validation and handoff

- [x] 3.1 Run `npm run rulebook:test`, `npm run validate:metadata`, `npm run validate:links`, `npm run validate:orphans`, and `npm run pdf`.
- [x] 3.2 Validate the OpenSpec change and review the scoped diff.
- [x] 3.3 Commit the validated task-scoped implementation automatically.
