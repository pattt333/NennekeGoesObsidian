import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from nenneke_v2_pipeline import (
    ARCHIVE,
    Archive,
    clean_inline,
    convert_tex,
    destination,
    generated_index,
    generated_rule_index,
    generated_sidebar,
    navigation_graph,
    note_navigation,
    relative_link,
    source_only_markdown,
)


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

    def test_reader_navigation_is_generated_from_include_graph(self):
        archive = Archive(ARCHIVE)
        try:
            source_map = {source: target for source in archive.entries if (target := destination(source))}
            children, parents = navigation_graph(archive, source_map)
            sidebar = generated_sidebar(archive, source_map, children)
            index = generated_index(archive, source_map)
            rule_index = generated_rule_index(source_map)
            navigation = note_navigation("Chapters/06_kampf/Kampfmanover.tex", source_map, children, parents)
        finally:
            archive.close()
        self.assertEqual(parents["Chapters/06_kampf/Kampfmanover.tex"], "Chapters/06_kampf/06_Kampf.tex")
        self.assertIn("## Regelbuch lesen", index)
        self.assertIn("## Am Spieltisch", index)
        self.assertIn("[Vollständiger Regelindex](regelindex.md)", index)
        self.assertNotIn("Alle Quellnotizen", sidebar)
        self.assertIn("[Vollständiger Regelindex](regelindex.md)", sidebar)
        self.assertIn("  - [Kampfmanover](rules/06_kampf/Kampfmanover.md)", sidebar)
        self.assertIn("[Abvenum Reine Speise](rules/ubernaturliche_fertigkeiten/allgemeine_zauber/Abvenum_Reine_Speise.md)", rule_index)
        self.assertIn("↑ [Kampf](06_Kampf.md)", navigation)
        self.assertIn("[Waffen](waffen/Waffen.md) →", navigation)

    def test_empty_source_placeholders_are_not_migrated(self):
        archive = Archive(ARCHIVE)
        try:
            unmatched = source_only_markdown(archive)
        finally:
            archive.close()
        self.assertNotIn("rules/07_vorteile/kampf_vorteile/Kampfvorteile.md", unmatched)


if __name__ == "__main__":
    unittest.main()
