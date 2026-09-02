function Pandoc(document)
  local styling = pandoc.RawBlock("typst", [[
#show quote.where(block: true): it => block(
  width: 100%,
  fill: luma(245),
  stroke: (left: 2pt + luma(120)),
  inset: (x: 10pt, y: 8pt),
  radius: 2pt,
)[#it.body]
]])
  table.insert(document.blocks, 1, styling)
  return document
end
