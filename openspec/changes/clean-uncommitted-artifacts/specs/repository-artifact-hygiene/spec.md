## ADDED Requirements

### Requirement: Reproducible conversion source retention
The repository SHALL retain `NennekeV2.zip` at the conversion pipeline's configured root path as the authoritative local input, and its recorded SHA-256 inventory SHALL continue to identify that input.

#### Scenario: Maintainer validates the converted vault
- **WHEN** a maintainer runs the Nenneke validation workflow
- **THEN** the workflow finds `NennekeV2.zip` and can compare it with the committed source inventory

### Requirement: Dispensable local artifacts are excluded
The repository SHALL exclude the obsolete V6.3.1 reference PDF, empty canvas, unrelated Foundry plan, and generated Python bytecode caches from the maintained project tree, while personal `.obsidian` state remains unmodified and unstaged.

#### Scenario: Maintainer reviews the cleaned working tree
- **WHEN** the cleanup is complete
- **THEN** the classified dispensable artifacts are absent, Python bytecode caches are ignored, and personal Obsidian state is not part of the cleanup commit

### Requirement: Historical PDF comparison is documented without a local binary dependency
The conversion documentation SHALL record the completed visual comparison with the V6.3.1 reference without asserting that `NennekeV6_3_1.pdf` is required in the repository.

#### Scenario: Maintainer reads the conversion guide
- **WHEN** a maintainer follows the PDF publication guidance
- **THEN** they can build the maintained PDF from Markdown without needing the removed V6.3.1 reference file
