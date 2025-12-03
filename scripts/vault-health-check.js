#!/usr/bin/env node
/**
 * vault-health-check.js - Finds broken Markdown links ([[...]]) within the vault
 * 
 * This script scans all Markdown files in the vault directory, identifies
 * Obsidian-style wiki links, and reports any that point to non-existent files.
 * 
 * Usage: node vault-health-check.js
 */

const fs = require('fs');
const path = require('path');

// Navigate to the repository root (parent of scripts folder)
const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.dirname(SCRIPT_DIR);
const VAULT_PATH = path.join(REPO_ROOT, 'vault');

// Regex to match Obsidian-style wiki links: [[link]] or [[link|display text]]
const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;

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
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * Resolves a wiki link to a file path
 * @param {string} link - The wiki link text (without brackets)
 * @param {string} sourceFile - The file containing the link
 * @returns {string|null} - Resolved file path or null if not found
 */
function resolveLink(link, sourceFile) {
  // Remove any heading anchors (e.g., [[file#heading]])
  const linkWithoutAnchor = link.split('#')[0].trim();
  
  if (!linkWithoutAnchor) {
    // Link to a heading in the same file
    return sourceFile;
  }
  
  // Try different resolution strategies
  const possiblePaths = [];
  
  // 1. Absolute path from vault root
  possiblePaths.push(path.join(VAULT_PATH, linkWithoutAnchor));
  possiblePaths.push(path.join(VAULT_PATH, linkWithoutAnchor + '.md'));
  
  // 2. Relative path from source file's directory
  const sourceDir = path.dirname(sourceFile);
  possiblePaths.push(path.join(sourceDir, linkWithoutAnchor));
  possiblePaths.push(path.join(sourceDir, linkWithoutAnchor + '.md'));
  
  // 3. Check if it's a directory (e.g., [[rules/combat/]])
  if (linkWithoutAnchor.endsWith('/')) {
    const dirPath = path.join(VAULT_PATH, linkWithoutAnchor);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      return dirPath;
    }
  }
  
  // Check each possible path
  for (const possiblePath of possiblePaths) {
    const normalizedPath = path.normalize(possiblePath);
    if (fs.existsSync(normalizedPath)) {
      return normalizedPath;
    }
  }
  
  return null;
}

/**
 * Extracts all wiki links from a file
 * @param {string} filePath - Path to the file
 * @returns {Array<{link: string, line: number}>} - Array of links with line numbers
 */
function extractLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const links = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    
    while ((match = WIKI_LINK_REGEX.exec(line)) !== null) {
      links.push({
        link: match[1],
        line: i + 1
      });
    }
  }
  
  return links;
}

/**
 * Main function to check vault health
 */
function main() {
  console.log('=== Vault Health Check ===\n');
  console.log(`Scanning vault at: ${VAULT_PATH}\n`);
  
  if (!fs.existsSync(VAULT_PATH)) {
    console.error(`Error: Vault directory not found at ${VAULT_PATH}`);
    process.exit(1);
  }
  
  const markdownFiles = findMarkdownFiles(VAULT_PATH);
  console.log(`Found ${markdownFiles.length} Markdown files\n`);
  
  const brokenLinks = [];
  let totalLinks = 0;
  
  for (const file of markdownFiles) {
    const links = extractLinks(file);
    totalLinks += links.length;
    
    for (const { link, line } of links) {
      const resolved = resolveLink(link, file);
      
      if (!resolved) {
        const relativePath = path.relative(VAULT_PATH, file);
        brokenLinks.push({
          file: relativePath,
          link,
          line
        });
      }
    }
  }
  
  // Output report
  console.log('=== Report ===\n');
  console.log(`Total links scanned: ${totalLinks}`);
  console.log(`Broken links found: ${brokenLinks.length}\n`);
  
  if (brokenLinks.length > 0) {
    console.log('Broken Links:\n');
    
    // Group by file
    const groupedByFile = {};
    for (const broken of brokenLinks) {
      if (!groupedByFile[broken.file]) {
        groupedByFile[broken.file] = [];
      }
      groupedByFile[broken.file].push(broken);
    }
    
    for (const [file, links] of Object.entries(groupedByFile)) {
      console.log(`📄 ${file}`);
      for (const { link, line } of links) {
        console.log(`   Line ${line}: [[${link}]]`);
      }
      console.log('');
    }
    
    process.exit(1);
  } else {
    console.log('✅ No broken links found!');
    process.exit(0);
  }
}

main();
