## 1. Release automation

- [x] 1.1 Add a release job that runs only after a successful push-to-`main` PDF build, uses `contents: write` only where needed, and serializes releases.
- [x] 1.2 Implement deterministic `v6.3.1` initial tagging and subsequent patch-version calculation from existing final tags.
- [x] 1.3 Create the GitHub Release and attach the built PDF with a versioned filename while retaining the workflow artifact.
- [x] 1.4 Make metadata validation accept LF and CRLF frontmatter so local and CI release validation agree.

## 2. Maintainer documentation

- [x] 2.1 Update the German deployment guide with automatic release behavior, the one-time GitHub permission, and download locations.
- [x] 2.2 Reconcile the active PDF-publication roadmap with the replacement of artifact-only publication.

## 3. Validation and handoff

- [x] 3.1 Check the workflow syntax and version-calculation path without creating a local tag or release.
- [x] 3.2 Run `npm run rulebook:test`, `npm run validate:metadata`, `npm run validate:links`, and `npm run validate:orphans`.
- [x] 3.3 Review the scoped diff and automatically commit the change after all local validation passes.
