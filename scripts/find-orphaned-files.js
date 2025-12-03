#!/usr/bin/env node
/**
 * find-orphaned-files.js - Identifies files not linked from index.md or other hub files
 * 
 * This script scans all Markdown files in the vault and identifies those that
 * are not referenced by any other file, starting from the main hub files
 * (index.md, _sidebar.md, and any other major navigation files).
 * 
 * Usage: node find-orphaned-files.js
 */

const fs = require('fs');
const path = require('path');

// Navigate to the repository root (parent of scripts folder)
const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.dirname(SCRIPT_DIR);
const VAULT_PATH = path.join(REPO_ROOT, 'vault');

// Hub files that serve as entry points
const HUB_FILES = ['index.md', '_sidebar.md', 'README.md'];

// Regex patterns for different link types
const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]*)\]\(([^)]+)\)/g;

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
 * Normalizes a link path to a consistent format
 * @param {string} link - The link path
 * @param {string} sourceFile - The file containing the link
 * @returns {string|null} - Normalized path relative to vault, or null if external
 */
function normalizeLink(link, sourceFile) {
  // Skip external links
  if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:')) {
    return null;
  }
  
  // Remove heading anchors
  let cleanLink = link.split('#')[0].trim();
  
  if (!cleanLink) {
    return null;
  }
  
  // Remove trailing slashes for directories
  cleanLink = cleanLink.replace(/\/$/, '');
  
  // Add .md extension if needed
  if (!cleanLink.endsWith('.md') && !cleanLink.includes('.')) {
    cleanLink = cleanLink + '.md';
  }
  
  // Resolve relative paths
  let fullPath;
  if (cleanLink.startsWith('/')) {
    fullPath = path.join(VAULT_PATH, cleanLink);
  } else {
    const sourceDir = path.dirname(sourceFile);
    fullPath = path.resolve(sourceDir, cleanLink);
  }
  
  // Normalize and get relative path from vault
  const normalizedPath = path.normalize(fullPath);
  
  // Ensure the path is within the vault
  if (!normalizedPath.startsWith(VAULT_PATH)) {
    return null;
  }
  
  return path.relative(VAULT_PATH, normalizedPath);
}

/**
 * Extracts all links from a file (both wiki and markdown style)
 * @param {string} filePath - Path to the file
 * @returns {string[]} - Array of normalized link targets
 */
function extractLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const links = new Set();
  
  // Extract wiki links
  let match;
  while ((match = WIKI_LINK_REGEX.exec(content)) !== null) {
    const normalized = normalizeLink(match[1], filePath);
    if (normalized) {
      links.add(normalized);
    }
  }
  
  // Reset regex state
  WIKI_LINK_REGEX.lastIndex = 0;
  
  // Extract markdown links
  while ((match = MARKDOWN_LINK_REGEX.exec(content)) !== null) {
    const normalized = normalizeLink(match[2], filePath);
    if (normalized) {
      links.add(normalized);
    }
  }
  
  // Reset regex state
  MARKDOWN_LINK_REGEX.lastIndex = 0;
  
  return Array.from(links);
}

/**
 * Builds a map of all files and their outgoing links
 * @param {string[]} files - Array of file paths
 * @returns {Map<string, string[]>} - Map of file paths to their links
 */
function buildLinkMap(files) {
  const linkMap = new Map();
  
  for (const file of files) {
    const relativePath = path.relative(VAULT_PATH, file);
    const links = extractLinks(file);
    linkMap.set(relativePath, links);
  }
  
  return linkMap;
}

/**
 * Finds all files reachable from hub files
 * @param {Map<string, string[]>} linkMap - Map of files to their links
 * @param {string[]} hubFiles - Starting points for traversal
 * @returns {Set<string>} - Set of reachable file paths
 */
function findReachableFiles(linkMap, hubFiles) {
  const reachable = new Set();
  const queue = [...hubFiles];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (reachable.has(current)) {
      continue;
    }
    
    reachable.add(current);
    
    const links = linkMap.get(current) || [];
    for (const link of links) {
      if (!reachable.has(link) && linkMap.has(link)) {
        queue.push(link);
      }
    }
  }
  
  return reachable;
}

/**
 * Main function to find orphaned files
 */
function main() {
  console.log('=== Find Orphaned Files ===\n');
  console.log(`Scanning vault at: ${VAULT_PATH}\n`);
  
  if (!fs.existsSync(VAULT_PATH)) {
    console.error(`Error: Vault directory not found at ${VAULT_PATH}`);
    process.exit(1);
  }
  
  const markdownFiles = findMarkdownFiles(VAULT_PATH);
  console.log(`Found ${markdownFiles.length} Markdown files\n`);
  
  // Build link map
  const linkMap = buildLinkMap(markdownFiles);
  
  // Find existing hub files
  const existingHubFiles = HUB_FILES.filter(hub => {
    const hubPath = path.join(VAULT_PATH, hub);
    return fs.existsSync(hubPath);
  });
  
  console.log(`Hub files: ${existingHubFiles.join(', ')}\n`);
  
  // Find reachable files from hubs
  const reachable = findReachableFiles(linkMap, existingHubFiles);
  
  // Find orphaned files (files that exist but are not reachable)
  const allFiles = Array.from(linkMap.keys());
  const orphaned = allFiles.filter(file => {
    // Exclude hub files themselves and special files
    if (HUB_FILES.includes(file)) {
      return false;
    }
    // Exclude files starting with 00- (index files like Tag Index)
    if (path.basename(file).startsWith('00-')) {
      return false;
    }
    return !reachable.has(file);
  });
  
  // Output report
  console.log('=== Report ===\n');
  console.log(`Total files: ${allFiles.length}`);
  console.log(`Reachable files: ${reachable.size}`);
  console.log(`Orphaned files: ${orphaned.length}\n`);
  
  if (orphaned.length > 0) {
    console.log('Orphaned Files (not linked from hub files):\n');
    
    // Group by directory
    const groupedByDir = {};
    for (const file of orphaned) {
      const dir = path.dirname(file);
      if (!groupedByDir[dir]) {
        groupedByDir[dir] = [];
      }
      groupedByDir[dir].push(path.basename(file));
    }
    
    for (const [dir, files] of Object.entries(groupedByDir).sort()) {
      console.log(`📁 ${dir || '(root)'}`);
      for (const file of files.sort()) {
        console.log(`   - ${file}`);
      }
      console.log('');
    }
    
    console.log('Suggestion: Consider linking these files from index.md or other hub files,');
    console.log('or remove them if they are no longer needed.');
    
    process.exit(1);
  } else {
    console.log('✅ No orphaned files found! All files are connected.');
    process.exit(0);
  }
}

main();
