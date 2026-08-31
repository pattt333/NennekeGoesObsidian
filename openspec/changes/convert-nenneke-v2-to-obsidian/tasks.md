## 1. Source inventory and conversion planning

- [ ] 1.1 Inspect `NennekeV2.zip`, calculate its SHA-256 checksum, and add a committed archive inventory with entry metadata.
- [ ] 1.2 Resolve the `main.tex` include tree, including nested `\\input` and `\\include` references, and record active versus commented publication inputs.
- [ ] 1.3 Create the source-to-Markdown manifest with one disposition for every non-empty relevant LaTeX source file.
- [ ] 1.4 Generate a migration report that classifies every existing Markdown-only file and maps renamed areas, including `08_rast` and `08_profanes`.
- [ ] 1.5 Inventory LaTeX commands and environments used by the source, identifying unsupported syntax before content replacement.

## 2. Conversion toolchain

- [ ] 2.1 Add declared project dependencies and commands for archive inventory, conversion, coverage reporting, and publication.
- [ ] 2.2 Implement a source resolver that reads the archive into a temporary workspace and preserves source-path provenance for every generated note.
- [ ] 2.3 Implement transformations for headings, prose, labels, internal references, emphasis, lists, quotations, tables, images, and the rulebook's supported custom constructs.
- [ ] 2.4 Emit actionable unsupported-construct reports instead of silently discarding LaTeX content.
- [ ] 2.5 Add focused automated checks for include resolution, manifest coverage, label/link conversion, and representative table and quotation transformations.

## 3. Staged Markdown conversion

- [ ] 3.1 Generate the complete source-derived Markdown tree into a staging location without overwriting the tracked vault.
- [ ] 3.2 Review representative generated content from every chapter, nested include group, table type, quotation type, image, and internal reference against `NennekeV2.zip`.
- [ ] 3.3 Verify that the coverage report accounts for every relevant source file and that the migration report accounts for every existing Markdown-only file.
- [ ] 3.4 Resolve all reported conversion defects and unsupported constructs required for the approved source scope.

## 4. Vault migration and navigation

- [ ] 4.1 Apply the approved staged Markdown output to `vault/rules/` and retain Markdown-only files until their migration classification is approved.
- [ ] 4.2 Rebuild `vault/index.md` and `vault/_sidebar.md` from the approved source chapter hierarchy.
- [ ] 4.3 Apply the source-label and old-path crosswalk to Markdown links, preserving stable Obsidian and Docsify navigation.
- [ ] 4.4 Run `npm run validate:links` and resolve every newly introduced broken link.
- [ ] 4.5 Run `npm run validate:orphans` and review all newly orphaned files against the migration report.
- [ ] 4.6 Preview the affected vault in Docsify and manually verify chapter navigation, child-note navigation, tables, quotations, images, and internal links.

## 5. PDF publication workflow

- [ ] 5.1 Evaluate a Markdown-to-PDF fidelity spike and select a German-capable, project-declared toolchain that supports title material, a table of contents, page numbering, tables, and quotations.
- [ ] 5.2 Add the publication manifest and metadata configuration for title material and chapters 1 through 9 in `main.tex` order.
- [ ] 5.3 Implement the documented PDF build command with a stable output path and a clean-workspace rebuild check.
- [ ] 5.4 Configure the initial publication to exclude Appendix A, spells, and liturgies while keeping their converted Markdown available in the vault.
- [ ] 5.5 Render and visually inspect the title page, table of contents, one table-heavy page, one quote-heavy page, every chapter boundary, and the final page against `NennekeV6_3_1.pdf`.
- [ ] 5.6 Resolve clipped, overlapping, missing, or unreadable PDF content and record the visual-review result.

## 6. Final verification and handoff

- [ ] 6.1 Run the conversion coverage checks, focused converter tests, `npm run validate:links`, and `npm run validate:orphans` from a clean working state.
- [ ] 6.2 Run `openspec validate "convert-nenneke-v2-to-obsidian" --strict` and resolve all validation errors.
- [ ] 6.3 Review the scoped diff, confirm that no personal Obsidian workspace changes or unrelated user edits are included, and automatically commit the validated implementation with a concise Conventional Commit message.
