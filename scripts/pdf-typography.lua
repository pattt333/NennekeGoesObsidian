function Pandoc(document)
  local typography = pandoc.RawBlock("typst", [[
#set par(leading: 0.72em, spacing: 0.85em)
#show heading.where(level: 1): set block(above: 1.7em, below: 0.9em)
#show heading.where(level: 2): set block(above: 1.55em, below: 0.7em)
#show heading.where(level: 3): set block(above: 1.25em, below: 0.55em)
#show list: set block(above: 0.45em, below: 0.65em)
]])
  table.insert(document.blocks, 1, typography)
  return document
end
