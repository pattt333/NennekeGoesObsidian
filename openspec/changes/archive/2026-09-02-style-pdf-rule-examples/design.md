## Context

Pandoc schreibt Markdown-Blockzitate als Typst-`quote(block: true)`. Eine Typst-Show-Regel kann diese ausschließlich in der PDF gestalten.

## Goals / Non-Goals

**Goals:** Dezent hervorgehobene, seitenübergreifend umbrechbare Regelbeispiele ohne Markdown- oder Obsidian-Änderung.

**Non-Goals:** Keine neue Markdown-Syntax und keine Änderung normaler Absätze.

## Decisions

Ein Lua-Filter fügt vor dem Dokument eine Typst-Show-Regel ein. Sie umschließt nur Blockzitate mit einem hellen, umbrechbaren Block und einer grauen linken Linie.

## Risks / Trade-offs

- [Zu starke Gestaltung lenkt vom Regeltext ab] → zurückhaltende Grauwerte und kleine Innenabstände.

## Validation Strategy

- PDF lokal erzeugen und die Beispiele aus Proben und Fertigkeiten visuell prüfen.
