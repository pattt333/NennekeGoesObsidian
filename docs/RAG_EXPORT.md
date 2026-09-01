# RAG-Export

npm run rag:export erzeugt build/rag/rulebook.jsonl. Jede Zeile ist ein JSON-Datensatz für eine Regelnotiz oder einen ##-Abschnitt mit ruleId, Titel, Abschnitt, kanonischem Vault-Link, Quellpfad, Inhalt und Inhalts-Hash.

Der Export ist absichtlich providerneutral: Dieses Repository enthält weder einen Vektorspeicher noch einen Chat-Client oder einen Bot. Ein späteres Retrieval-System kann die JSONL-Datei importieren, ohne dass die Regeltexte dafür erneut aufbereitet werden müssen.
