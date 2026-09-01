import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from nenneke_v2_pipeline import ARCHIVE, Archive, clean_inline, convert_tex, relative_link


class PipelineTest(unittest.TestCase):
    def test_relative_link_from_nested_note(self):
        self.assertEqual(relative_link("rules/06_kampf/waffen/Waffen.md", "rules/01_Proben.md"), "../../01_Proben.md")

    def test_label_reference_uses_relative_markdown_link(self):
        labels = {"sec:test": {"path": "rules/01_Proben.md", "anchor": "sec-test", "source": "Chapters/01_Proben.tex"}}
        self.assertEqual(clean_inline(r"\hyperref[sec:test]{Test}", labels, set(), "rules/06_kampf/06_Kampf.md"), "[Test](../01_Proben.md#sec-test)")

    def test_main_include_tree_starts_with_active_chapters(self):
        archive = Archive(ARCHIVE)
        try:
            tree = archive.include_tree()
        finally:
            archive.close()
        self.assertEqual(tree[:3], ["Chapters/01_Proben.tex", "Chapters/02_Charaktere.tex", "Chapters/03_Eigenschaften.tex"])

    def test_table_and_quote_are_transformed(self):
        rendered, unsupported = convert_tex(
            "Chapters/example.tex",
            "\\section{Beispiel}\n\\begin{quote}\nEin Zitat.\n\\end{quote}\n\\begin{tabular}{l l}\nName & Wert \\\\\nHeld & 12 \\\\\n\\end{tabular}",
            {},
            {"Chapters/example.tex": "rules/example.md"},
        )
        self.assertIn("> Ein Zitat.", rendered)
        self.assertIn("| Name | Wert |", rendered)
        self.assertEqual(unsupported, set())


if __name__ == "__main__":
    unittest.main()
