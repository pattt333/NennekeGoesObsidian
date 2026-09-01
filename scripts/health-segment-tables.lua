local palette = {
  ["health-segment--critical"] = "#f89883",
  ["health-segment--warning"] = "#fffea1",
  ["health-segment--safe"] = "#80fa99",
}

local function class_for(blocks)
  for _, block in ipairs(blocks) do
    local inlines = block.content or {}
    for _, inline in ipairs(inlines) do
      if inline.t == "Span" then
        for _, class in ipairs(inline.classes) do
          if palette[class] then return class end
        end
      end
    end
  end
  return nil
end

local function escape_typst(text)
  local escaped = text:gsub("\\", "\\\\"):gsub("#", "\\#"):gsub("%[", "\\["):gsub("%]", "\\]")
  return escaped
end

local function inline_text(inlines)
  local parts = {}
  for _, inline in ipairs(inlines) do
    if inline.t == "Str" then table.insert(parts, escape_typst(inline.text))
    elseif inline.t == "Space" or inline.t == "SoftBreak" then table.insert(parts, " ")
    elseif inline.t == "Strong" then table.insert(parts, "*" .. inline_text(inline.content) .. "*")
    elseif inline.t == "Emph" then table.insert(parts, "_" .. inline_text(inline.content) .. "_")
    elseif inline.t == "Code" then table.insert(parts, "`" .. escape_typst(inline.text) .. "`")
    elseif inline.content then table.insert(parts, inline_text(inline.content))
    end
  end
  return table.concat(parts)
end

local function cell_text(cell)
  local parts = {}
  for _, block in ipairs(cell.contents) do
    if block.content then table.insert(parts, inline_text(block.content)) end
  end
  return table.concat(parts, " ")
end

local function typst_cell(cell, fill)
  local options = fill and ("fill: rgb(\"" .. fill .. "\"), ") or ""
  return "table.cell(" .. options .. ")[" .. cell_text(cell) .. "]"
end

function Table(tbl)
  local header = tbl.head.rows[1]
  if not header then return nil end

  local has_segments = false
  for _, cell in ipairs(header.cells) do
    if class_for(cell.contents) then
      has_segments = true
      break
    end
  end
  if not has_segments then return nil end

  local column_count = #header.cells
  local columns = {}
  for _ = 1, column_count do table.insert(columns, "auto") end
  local parts = {
    "#table(",
    "  columns: (" .. table.concat(columns, ", ") .. "),",
    "  align: center + horizon,",
    "  stroke: 0.5pt + luma(130),",
    "  inset: 3pt,",
    "  table.header(",
  }

  for _, cell in ipairs(header.cells) do
    local class = class_for(cell.contents)
    table.insert(parts, "    " .. typst_cell(cell, class and palette[class]) .. ",")
  end
  table.insert(parts, "  ),")

  for _, body in ipairs(tbl.bodies) do
    for _, row in ipairs(body.body) do
      for index, cell in ipairs(row.cells) do
        local content = typst_cell(cell)
        if index == 1 then content = "table.cell(align: left)[" .. cell_text(cell) .. "]" end
        table.insert(parts, "  " .. content .. ",")
      end
    end
  end

  table.insert(parts, ")")
  return pandoc.RawBlock("typst", table.concat(parts, "\n"))
end
