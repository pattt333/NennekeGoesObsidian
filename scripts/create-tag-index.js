#!/usr/bin/env node
/**
 * create-tag-index.js - Scans all files for #tags and generates a summary file
 * 
 * This script scans all Markdown files in the vault, extracts hashtags,
 * and generates a summary file at vault/00-Tag-Index.md organized by tag.
 * 
 * Usage: node create-tag-index.js
 */

const fs = require('fs');
const path = require('path');

// Navigate to the repository root (parent of scripts folder)
const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.dirname(SCRIPT_DIR);
const VAULT_PATH = path.join(REPO_ROOT, 'vault');
const OUTPUT_FILE = path.join(VAULT_PATH, '00-Tag-Index.md');

// Regex to match hashtags (excluding those inside code blocks)
// Matches #tag but not ##heading or #123 or tags inside URLs
const TAG_REGEX = /(?:^|[\s\[({])#([a-zA-Z][a-zA-Z0-9_-]*)/g;

/**
 * Recursively finds all Markdown files in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} fileList - Accumulator for found files
 * @returns {string[]} - Array of file paths
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip hidden directories and .obsidian
      if (!file.startsWith('.')) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      // Skip the output file itself
      if (filePath !== OUTPUT_FILE) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
}

/**
 * Removes code blocks from content to avoid matching tags in code
 * @param {string} content - File content
 * @returns {string} - Content with code blocks removed
 */
function removeCodeBlocks(content) {
  // Remove fenced code blocks (``` ... ```)
  content = content.replace(/```[\s\S]*?```/g, '');
  // Remove inline code (`...`)
  content = content.replace(/`[^`]+`/g, '');
  return content;
}

/**
 * Extracts all tags from a file
 * @param {string} filePath - Path to the file
 * @returns {string[]} - Array of unique tags found
 */
function extractTags(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = removeCodeBlocks(content);
  
  const tags = new Set();
  let match;
  
  while ((match = TAG_REGEX.exec(content)) !== null) {
    // Convert to lowercase for consistency
    tags.add(match[1].toLowerCase());
  }
  
  // Reset regex state
  TAG_REGEX.lastIndex = 0;
  
  return Array.from(tags).sort();
}

/**
 * Generates the tag index Markdown content
 * @param {Map<string, string[]>} tagMap - Map of tags to file paths
 * @returns {string} - Markdown content for the index
 */
function generateIndexContent(tagMap) {
  const lines = [];
  const timestamp = new Date().toISOString().split('T')[0];
  
  lines.push('# Tag Index');
  lines.push('');
  lines.push(`> Auto-generated on ${timestamp} by \`create-tag-index.js\``);
  lines.push('');
  lines.push('This index lists all tags found in the vault and the files that contain them.');
  lines.push('');
  
  // Sort tags alphabetically
  const sortedTags = Array.from(tagMap.keys()).sort();
  
  if (sortedTags.length === 0) {
    lines.push('*No tags found in the vault.*');
  } else {
    // Table of contents
    lines.push('## Quick Navigation');
    lines.push('');
    
    // Group by first letter
    const letterGroups = {};
    for (const tag of sortedTags) {
      const letter = tag[0].toUpperCase();
      if (!letterGroups[letter]) {
        letterGroups[letter] = [];
      }
      letterGroups[letter].push(tag);
    }
    
    const letters = Object.keys(letterGroups).sort();
    lines.push(letters.map(l => `[${l}](#${l.toLowerCase()})`).join(' | '));
    lines.push('');
    
    // Tag sections by letter
    lines.push('---');
    lines.push('');
    
    for (const letter of letters) {
      lines.push(`## ${letter}`);
      lines.push('');
      
      for (const tag of letterGroups[letter]) {
        const files = tagMap.get(tag);
        lines.push(`### #${tag}`);
        lines.push('');
        
        for (const file of files.sort()) {
          // Create a wiki link without .md extension
          const linkPath = file.replace(/\.md$/, '');
          const fileName = path.basename(file, '.md');
          lines.push(`- [[${linkPath}|${fileName}]]`);
        }
        
        lines.push('');
      }
    }
  }
  
  // Summary statistics
  lines.push('---');
  lines.push('');
  lines.push('## Statistics');
  lines.push('');
  lines.push(`- **Total tags:** ${sortedTags.length}`);
  
  let totalUsages = 0;
  for (const files of tagMap.values()) {
    totalUsages += files.length;
  }
  lines.push(`- **Total tag usages:** ${totalUsages}`);
  
  return lines.join('\n');
}

/**
 * Main function to create the tag index
 */
function main() {
  console.log('=== Create Tag Index ===\n');
  console.log(`Scanning vault at: ${VAULT_PATH}\n`);
  
  if (!fs.existsSync(VAULT_PATH)) {
    console.error(`Error: Vault directory not found at ${VAULT_PATH}`);
    process.exit(1);
  }
  
  const markdownFiles = findMarkdownFiles(VAULT_PATH);
  console.log(`Found ${markdownFiles.length} Markdown files\n`);
  
  // Build tag map: tag -> [files]
  const tagMap = new Map();
  let totalTags = 0;
  
  for (const file of markdownFiles) {
    const relativePath = path.relative(VAULT_PATH, file);
    const tags = extractTags(file);
    
    for (const tag of tags) {
      totalTags++;
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag).push(relativePath);
    }
  }
  
  console.log(`Found ${tagMap.size} unique tags`);
  console.log(`Total tag usages: ${totalTags}\n`);
  
  // Generate and write index file
  const content = generateIndexContent(tagMap);
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  
  console.log(`✅ Tag index generated at: ${path.relative(REPO_ROOT, OUTPUT_FILE)}`);
  
  if (tagMap.size > 0) {
    console.log('\nMost used tags:');
    const sortedByUsage = Array.from(tagMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5);
    
    for (const [tag, files] of sortedByUsage) {
      console.log(`  #${tag}: ${files.length} file(s)`);
    }
  }
  
  process.exit(0);
}

main();
