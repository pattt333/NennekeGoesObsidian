#!/bin/bash
# convert-latex-to-md.sh - Converts LaTeX files to Markdown using pandoc
# This script uses pandoc to convert a given .tex file to .md and places it in the vault folder.
# Usage: ./convert-latex-to-md.sh <input.tex> [output_folder]
#   <input.tex>     - Path to the LaTeX file to convert
#   [output_folder] - Optional: subfolder in vault/ to place the output (default: vault/)

# Exit on error
set -e

# Navigate to the repository root (parent of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed."
    echo "Please install pandoc: https://pandoc.org/installing.html"
    exit 1
fi

# Check for input file argument
if [ -z "$1" ]; then
    echo "Usage: $0 <input.tex> [output_folder]"
    echo "  <input.tex>     - Path to the LaTeX file to convert"
    echo "  [output_folder] - Optional: subfolder in vault/ to place the output (default: vault/)"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FOLDER="${2:-vault}"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found."
    exit 1
fi

# Check if input file is a .tex file
if [[ "$INPUT_FILE" != *.tex ]]; then
    echo "Warning: Input file does not have .tex extension. Proceeding anyway..."
fi

# Create output folder if it doesn't exist
if [ ! -d "$OUTPUT_FOLDER" ]; then
    echo "Creating output folder: $OUTPUT_FOLDER"
    mkdir -p "$OUTPUT_FOLDER"
fi

# Generate output filename (replace .tex with .md)
BASENAME=$(basename "$INPUT_FILE" .tex)
OUTPUT_FILE="$OUTPUT_FOLDER/$BASENAME.md"

echo "=== Converting LaTeX to Markdown at $(date) ==="
echo "Input: $INPUT_FILE"
echo "Output: $OUTPUT_FILE"

# Convert using pandoc (with options for better markdown output)
pandoc -f latex -t markdown --wrap=preserve --standalone -o "$OUTPUT_FILE" "$INPUT_FILE"

echo "=== Conversion complete: $OUTPUT_FILE ==="
