## 1. Markdown source promotion

- [ ] 1.1 Record and review a final Markdown-completeness baseline against the ZIP mapping, including editorial design-principle material and current publication scope.
- [ ] 1.2 Move all retained editorial source material into the Markdown authoring tree and remove generator-only ownership from reader-visible rule content.
- [ ] 1.3 Retire `NennekeV2.zip`, the LaTeX conversion pipeline, conversion reports, and obsolete package commands after the baseline is accepted.
- [ ] 1.4 Update contributor and maintenance documentation for Markdown-first editing and Git-history rollback.

## 2. Authoring conventions and link health

- [ ] 2.1 Add a concise German authoring guide and templates for headings, tables, rule boxes, examples, formulas, links, metadata, and assets.
- [ ] 2.2 Extend validation to cover relative Markdown links in published vault content.
- [ ] 2.3 Validate the guide against representative existing chapters and preview the resulting Docsify rendering.

## 3. Stable rule identifiers

- [ ] 3.1 Define the ID namespace, frontmatter schema, heading-based citation convention, and migration rules.
- [ ] 3.2 Assign unique IDs to addressable rule notes and create a generated ID/citation index.
- [ ] 3.3 Add validation for unique IDs, valid metadata, and canonical citation links.

## 4. Configurable PDF publication

- [ ] 4.1 Run a representative PDF fidelity spike and select the Markdown-first toolchain for local and CI builds.
- [ ] 4.2 Add `publication.yml` with ordered current core chapters and the agreed initial selection of spells and liturgies.
- [ ] 4.3 Implement the local PDF command from that manifest and validate layout, contents, selected magic material, and exclusions.

## 5. Continuous PDF build

- [ ] 5.1 Add `.github/workflows/build.yml` for push-to-`main` and manual validation/PDF builds.
- [ ] 5.2 Upload the generated PDF as a workflow artifact without committing it back to the repository.
- [ ] 5.3 Verify a GitHub Actions run and document how maintainers retrieve the build output.

## 6. Retrieval preparation

- [ ] 6.1 Define and generate the provider-neutral rule-record export with IDs, sections, canonical links, content, and hashes.
- [ ] 6.2 Add deterministic retrieval/citation fixture validation without an LLM provider or external service.
- [ ] 6.3 Document the external RAG-service boundary and explicitly keep Discord and Foundry out of this repository.

## 7. Validation and handoff

- [ ] 7.1 Run Markdown, ID, publication, PDF, link, orphan, and CI validation appropriate to each completed phase.
- [ ] 7.2 Review each phase's scoped diff and automatically commit it with a concise Conventional Commit message after validation succeeds.
