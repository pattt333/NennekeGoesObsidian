## Context

`Cover_Figure.png` and `example_figure.jpeg` are generated from the ZIP despite having no Markdown references. Regeneration therefore restores files that the vault does not use.

## Goals / Non-Goals

**Goals:** remove the two generated image assets and prevent them from returning.

**Non-Goals:** modify the ZIP archive, remove any future referenced content, or alter rule text.

## Decisions

- Treat `vault/assets/` as generated output owned by the conversion pipeline.
- Do not copy ZIP image files into staging; remove the generated asset directory when applying staged output.

## Risks / Trade-offs

- [A future source adds image links] → link validation exposes missing assets, and the copying policy can be reconsidered with an explicit change.
