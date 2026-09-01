# Nenneke V2 Conversion

`NennekeV2.zip` is the authoritative LaTeX input for the vault conversion. The archive is never modified; the pipeline identifies it by SHA-256 in `conversion/nenneke-v2/inventory.json`.

## Prerequisites

- Node.js 18 or later
- Python 3.11 or later
- `pip install -r requirements.txt` for PDF generation

On Windows, the commands use the Python launcher when available. If Python is installed in a non-standard location, set `NENNEKE_PYTHON` to the interpreter path before running a command.

## Workflow

```bash
npm run nenneke:inventory
npm run nenneke:convert
npm run nenneke:validate
npm run nenneke:test
npm run nenneke:apply
npm run nenneke:pdf
```

`convert` writes Markdown to `build/nenneke-v2/vault` and reports to `conversion/nenneke-v2/`; it does not modify the vault. Review the migration and unsupported-construct reports before `apply` copies source-derived notes and navigation into `vault/`.

`pdf` writes `output/pdf/NennekeV2.pdf`. Its initial scope matches the active `main.tex` include tree: title material, table of contents, and chapters 1-9. Appendix A, spells, and liturgies remain available in the vault but are excluded from the PDF.

## Publication review

The PDF uses ReportLab with a two-pass table-of-contents build. The initial publication was reviewed on 2026-09-01 against `NennekeV6_3_1.pdf`: the title page, table of contents, a prose-and-quotation page, table layout, chapter page boundaries, and final page render without clipping or overlap. The first-pass blank contents page was removed before this review. The source V2 publication contains 130 Letter-sized pages; its active `main.tex` tree intentionally differs from the supplied V6.3.1 reference.
