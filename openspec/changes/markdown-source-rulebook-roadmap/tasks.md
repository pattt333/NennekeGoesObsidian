## 1. Markdown source promotion

- [x] 1.1 Record and review a final Markdown-completeness baseline against the ZIP mapping, including editorial design-principle material and current publication scope.
- [x] 1.2 Move all retained editorial source material into the Markdown authoring tree and remove generator-only ownership from reader-visible rule content.
- [x] 1.3 Retire `NennekeV2.zip`, the LaTeX conversion pipeline, conversion reports, and obsolete package commands after the baseline is accepted.
- [x] 1.4 Update contributor and maintenance documentation for Markdown-first editing and Git-history rollback.

## 2. Authoring conventions and link health

- [x] 2.1 Add a concise German authoring guide and templates for headings, tables, rule boxes, examples, formulas, links, metadata, and assets.
- [x] 2.2 Extend validation to cover relative Markdown links in published vault content.
- [x] 2.3 Validate the guide against representative existing chapters and preview the resulting Docsify rendering.

## 3. Stable rule identifiers

- [x] 3.1 Define the ID namespace, frontmatter schema, heading-based citation convention, and migration rules.
- [x] 3.2 Assign unique IDs to addressable rule notes and create a generated ID/citation index.
- [x] 3.3 Add validation for unique IDs, valid metadata, and canonical citation links.

## 4. Source-managed PDF publication

- [x] 4.1 Run a representative PDF fidelity spike and select the Markdown-first toolchain for local and CI builds.
- [x] 4.2 Add a minimal `book.yaml` plus a dedicated Markdown build entry tree that starts at `vault/book/index.md` and expresses the current chapter order with recursive `![[...]]` embeds.
- [x] 4.3 Implement and test a resolver for relative and vault-wide build embeds, duplicate detection, and cycle detection; normal links must not be included.
- [x] 4.4 Add the agreed initial spell/liturgy embeds and implement the local PDF command from the resolved order; validate layout, contents, selected magic material, and exclusions.
- [x] 4.5 Start every primary chapter represented by `vault/book/chapters/` on a new PDF page.
- [x] 4.6 Preserve Obsidian-compatible bullet lists that directly follow a bold label in the PDF output.

## 5. Continuous PDF build

- [x] 5.1 Add `.github/workflows/build.yml` for push-to-`main` and manual validation/PDF builds.
- [x] 5.2 Upload the generated PDF as a workflow artifact without committing it back to the repository or creating a release.
- [ ] 5.3 Verify a GitHub Actions run and document how maintainers retrieve the build output.

## 6. Retrieval preparation

- [x] 6.1 Define and generate the provider-neutral rule-record export with IDs, sections, canonical links, content, and hashes.
- [x] 6.2 Add deterministic retrieval/citation fixture validation without an LLM provider or external service.
- [x] 6.3 Document the external RAG-service boundary and explicitly keep Discord and Foundry out of this repository.

## 7. Validation and handoff

- [ ] 7.1 Run Markdown, ID, publication, PDF, link, orphan, and CI validation appropriate to each completed phase.
- [x] 7.2 Review each phase's scoped diff and automatically commit it with a concise Conventional Commit message after validation succeeds.
