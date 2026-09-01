# Nenneke-Regelbuch in Obsidian

Dieses Repository enthält das Nenneke-Regelbuch als Obsidian-Vault und als optionale Docsify-Webansicht. Zum Lesen benötigst du weder die Konvertierung noch technische Werkzeuge.

## Regelbuch einrichten

1. Lade das Repository herunter oder klone es mit Git.
2. Öffne Obsidian und wähle **Ordner als Vault öffnen**.
3. Wähle den Ordner [`vault`](vault/) innerhalb des heruntergeladenen Repositorys.
4. Öffne die Datei [Nenneke](vault/index.md). Sie ist die Startseite des Regelbuchs.

Beim ersten Öffnen legt Obsidian persönliche Dateien wie dein Fensterlayout, die Graph-Ansicht und Lesezeichen an. Diese bleiben lokal und gehören nicht in einen gemeinsamen Commit.

## Am Spieltisch lesen und nachschlagen

- Die Startseite bietet den vollständigen Kapitelweg sowie direkte Einstiege für häufige Fragen zu Proben, Fertigkeiten, Gesundheit, Kampf, Vorteilen und übernatürlichen Fähigkeiten.
- Nutze die Dateiansicht links für die Kapitelstruktur. Die Notizen enthalten Links zurück zum übergeordneten Abschnitt sowie – wenn vorhanden – zur vorherigen und nächsten Notiz.
- Mit **Strg+O** öffnest du den Schnellwechsler: Tippe einfach einen Regelbegriff oder Namen ein.
- Mit **Strg+Umschalt+F** durchsuchst du den gesamten Regeltext.
- Die Ansicht **Gliederung** zeigt die Überschriften der gerade geöffneten Notiz.
- Fahre mit der Maus über einen Link, um mit der Seitenvorschau nachzusehen, ohne die aktuelle Regel zu verlassen.
- Lege persönliche Lesezeichen für oft verwendete Kapitel oder Regeln an, zum Beispiel Kampf oder die Charaktererschaffung.

## Optionale Webansicht

Wenn Node.js und die Docsify-CLI installiert sind, kannst du die Webansicht im Repository-Hauptordner starten:

```powershell
npm run serve
```

Öffne danach `http://localhost:3000` im Browser. Die Webansicht und Obsidian verwenden dieselbe Regelwerk-Navigation.

## Für Mitwirkende

Das Regelwerk wird aus `NennekeV2.zip` erzeugt. Hinweise zur Konvertierung und Pflege stehen in [docs/NENNEKE_V2_CONVERSION.md](docs/NENNEKE_V2_CONVERSION.md) und [docs/MAINTENANCE.md](docs/MAINTENANCE.md).
