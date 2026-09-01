#!/usr/bin/env node
"use strict";

const { validateLinks } = require("./rulebook-tools");

try {
  console.log("Validated " + validateLinks() + " Obsidian and Markdown links.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
