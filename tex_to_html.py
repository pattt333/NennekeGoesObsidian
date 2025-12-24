#!/usr/bin/env python3
"""
Simple LaTeX to HTML converter for TTRPG rulebook
Converts basic LaTeX structure to HTML sections
"""

import re
import sys
import os


def sanitize_id(text):
    """Convert text to a valid HTML id"""
    # Convert to lowercase
    text = text.lower()
    # Replace spaces and special characters with hyphens
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    # Remove leading/trailing hyphens
    text = text.strip('-')
    return text


def clean_latex_command(text):
    """Remove or convert basic LaTeX commands to plain text or HTML"""
    # Remove \label{} but keep the label for potential id attributes
    text = re.sub(r'\\label\{([^}]+)\}', '', text)
    
    # Remove \input{} commands
    text = re.sub(r'\\input\{[^}]+\}', '', text)
    
    # Convert \textit{} to <em>
    text = re.sub(r'\\textit\{([^}]+)\}', r'<em>\1</em>', text)
    
    # Convert \textbf{} to <strong>
    text = re.sub(r'\\textbf\{([^}]+)\}', r'<strong>\1</strong>', text)
    
    # Remove \hyperref[]{}
    text = re.sub(r'\\hyperref\[[^\]]+\]\{([^}]+)\}', r'\1', text)
    
    # Remove \num{} but keep the content
    text = re.sub(r'\\num\{([^}]+)\}', r'\1', text)
    
    # Remove newpage
    text = re.sub(r'\\newpage', '', text)
    
    # Remove other common commands
    text = re.sub(r'\\begin\{align\}', '', text)
    text = re.sub(r'\\end\{align\}', '', text)
    
    return text.strip()


def extract_label(line):
    """Extract label from a line if it exists"""
    match = re.search(r'\\label\{([^}]+)\}', line)
    return match.group(1) if match else None


def parse_table(lines, start_idx):
    """Parse a LaTeX tabular environment and convert to HTML table"""
    table_lines = []
    i = start_idx + 1
    
    # Collect all lines until \end{tabular}
    while i < len(lines) and '\\end{tabular' not in lines[i]:
        line = lines[i].strip()
        if line and not line.startswith('%'):
            table_lines.append(line)
        i += 1
    
    # Parse table rows
    rows = []
    current_row = []
    
    for line in table_lines:
        # Skip \hline and similar commands
        if line.startswith('\\hline') or line.startswith('\\cline'):
            continue
        
        # Check if line ends with \\
        if '\\\\' in line:
            # Remove the \\ and add to current row
            line = line.replace('\\\\', '').strip()
            if line:
                current_row.append(line)
            if current_row:
                # Join accumulated lines and split by &
                full_row = ' '.join(current_row)
                cells = [cell.strip() for cell in full_row.split('&')]
                rows.append(cells)
                current_row = []
        else:
            current_row.append(line)
    
    # Handle any remaining row
    if current_row:
        full_row = ' '.join(current_row)
        cells = [cell.strip() for cell in full_row.split('&')]
        rows.append(cells)
    
    if not rows:
        return '        <p><em>[Empty table]</em></p>'
    
    # Build HTML table
    html = ['        <table>']
    
    # First row with \textbf is likely a header
    first_row_is_header = any('\\textbf{' in cell for cell in rows[0]) if rows else False
    
    if first_row_is_header and len(rows) > 0:
        html.append('            <thead>')
        html.append('                <tr>')
        for cell in rows[0]:
            cell_content = clean_latex_command(cell)
            html.append(f'                    <th>{cell_content}</th>')
        html.append('                </tr>')
        html.append('            </thead>')
        rows = rows[1:]  # Remove header row from body
    
    if rows:
        html.append('            <tbody>')
        for row in rows:
            html.append('                <tr>')
            for cell in row:
                cell_content = clean_latex_command(cell)
                html.append(f'                    <td>{cell_content}</td>')
            html.append('                </tr>')
        html.append('            </tbody>')
    
    html.append('        </table>')
    
    return '\n'.join(html)


def convert_tex_to_html(tex_content):
    """Convert LaTeX content to HTML structure"""
    html_parts = []
    lines = tex_content.split('\n')
    
    i = 0
    in_quote = False
    in_enumerate = False
    in_itemize = False
    in_tabular = False
    current_paragraph = []
    chapter_title = None
    chapter_id = None
    section_counter = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines when not in a paragraph
        if not line:
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                para_text = clean_latex_command(para_text)
                if para_text:
                    html_parts.append(f'        <p>{para_text}</p>')
                current_paragraph = []
            i += 1
            continue
        
        # Handle \chapter{}
        if line.startswith('\\chapter{'):
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                para_text = clean_latex_command(para_text)
                if para_text:
                    html_parts.append(f'        <p>{para_text}</p>')
                current_paragraph = []
            
            chapter_match = re.search(r'\\chapter\{([^}]+)\}', line)
            if chapter_match:
                chapter_title = chapter_match.group(1)
                # Check for label on same or next line
                chapter_id = extract_label(line)
                if not chapter_id and i + 1 < len(lines):
                    chapter_id = extract_label(lines[i + 1])
            i += 1
            continue
        
        # Handle \section{}
        if line.startswith('\\section{'):
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                para_text = clean_latex_command(para_text)
                if para_text:
                    html_parts.append(f'        <p>{para_text}</p>')
                current_paragraph = []
            
            section_match = re.search(r'\\section\{([^}]+)\}', line)
            if section_match:
                section_title = section_match.group(1)
                section_id = extract_label(line)
                if not section_id and i + 1 < len(lines):
                    section_id = extract_label(lines[i + 1])
                
                # Generate id if not found
                if not section_id:
                    section_counter += 1
                    section_id = f"sec-{sanitize_id(section_title)}"
                
                html_parts.append(f'        <h3 id="{section_id}">{section_title}</h3>')
            i += 1
            continue
        
        # Handle \label{} on its own line (already extracted, skip it)
        if line.startswith('\\label{'):
            i += 1
            continue
        
        # Handle \begin{quote}
        if line.startswith('\\begin{quote}'):
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                para_text = clean_latex_command(para_text)
                if para_text:
                    html_parts.append(f'        <p>{para_text}</p>')
                current_paragraph = []
            in_quote = True
            html_parts.append('        <blockquote>')
            i += 1
            continue
        
        # Handle \end{quote}
        if line.startswith('\\end{quote}'):
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                para_text = clean_latex_command(para_text)
                if para_text:
                    html_parts.append(f'            <p><em>{para_text}</em></p>')
                current_paragraph = []
            html_parts.append('        </blockquote>')
            in_quote = False
            i += 1
            continue
        
        # Handle \begin{enumerate}
        if line.startswith('\\begin{enumerate}'):
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                para_text = clean_latex_command(para_text)
                if para_text:
                    html_parts.append(f'        <p>{para_text}</p>')
                current_paragraph = []
            in_enumerate = True
            html_parts.append('        <ol>')
            i += 1
            continue
        
        # Handle \end{enumerate}
        if line.startswith('\\end{enumerate}'):
            html_parts.append('        </ol>')
            in_enumerate = False
            i += 1
            continue
        
        # Handle \begin{itemize}
        if line.startswith('\\begin{itemize}'):
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                para_text = clean_latex_command(para_text)
                if para_text:
                    html_parts.append(f'        <p>{para_text}</p>')
                current_paragraph = []
            in_itemize = True
            html_parts.append('        <ul>')
            i += 1
            continue
        
        # Handle \end{itemize}
        if line.startswith('\\end{itemize}'):
            html_parts.append('        </ul>')
            in_itemize = False
            i += 1
            continue
        
        # Handle \item in enumerate or itemize
        if (in_enumerate or in_itemize) and line.startswith('\\item'):
            item_text = re.sub(r'\\item\s*', '', line)
            item_text = clean_latex_command(item_text)
            html_parts.append(f'            <li>{item_text}</li>')
            i += 1
            continue
        
        # Handle tabular environments
        if '\\begin{tabular' in line:
            if current_paragraph:
                para_text = ' '.join(current_paragraph)
                para_text = clean_latex_command(para_text)
                if para_text:
                    html_parts.append(f'        <p>{para_text}</p>')
                current_paragraph = []
            
            # Parse the table
            table_html = parse_table(lines, i)
            html_parts.append(table_html)
            
            # Skip to end of table
            while i < len(lines) and '\\end{tabular' not in lines[i]:
                i += 1
            i += 1  # Skip the \end{tabular} line
            continue
        
        # Skip \input{} commands
        if line.startswith('\\input{'):
            i += 1
            continue
        
        # Skip comments
        if line.startswith('%'):
            i += 1
            continue
        
        # Regular text - accumulate into paragraph
        if not line.startswith('\\'):
            current_paragraph.append(line)
            i += 1
            continue
        
        # Any other LaTeX command - try to clean and add to paragraph
        cleaned = clean_latex_command(line)
        if cleaned:
            current_paragraph.append(cleaned)
        i += 1
    
    # Flush any remaining paragraph
    if current_paragraph:
        para_text = ' '.join(current_paragraph)
        para_text = clean_latex_command(para_text)
        if para_text:
            html_parts.append(f'        <p>{para_text}</p>')
    
    # Build the final section
    result = []
    
    # Generate section id if chapter_id doesn't exist
    if chapter_title and not chapter_id:
        chapter_id = f"chap-{sanitize_id(chapter_title)}"
    
    # Use chapter_id for section, or generate a generic one
    section_id = chapter_id if chapter_id else "section-1"
    
    result.append(f'    <section class="chapter" id="{section_id}">')
    
    if chapter_title:
        h2_id = f"{section_id}-title" if chapter_id else sanitize_id(chapter_title)
        result.append(f'        <h2 id="{h2_id}">{chapter_title}</h2>')
    
    result.extend(html_parts)
    result.append('    </section>')
    
    return '\n'.join(result)


def main():
    if len(sys.argv) < 2:
        print("Usage: python tex_to_html.py <input.tex|folder> [output.html]")
        print("If input is a folder, all .tex files in it will be processed")
        print("If output file is not specified, prints to stdout")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    if not os.path.exists(input_path):
        print(f"Error: Path '{input_path}' not found")
        sys.exit(1)
    
    # Collect files to process
    tex_files = []
    if os.path.isdir(input_path):
        # Get all .tex files in the directory
        for filename in sorted(os.listdir(input_path)):
            if filename.endswith('.tex'):
                tex_files.append(os.path.join(input_path, filename))
        
        if not tex_files:
            print(f"Error: No .tex files found in directory '{input_path}'")
            sys.exit(1)
        
        print(f"Found {len(tex_files)} .tex file(s) to process")
    else:
        # Single file
        if not input_path.endswith('.tex'):
            print(f"Warning: '{input_path}' does not have .tex extension")
        tex_files.append(input_path)
    
    # Process all files
    all_html = []
    for tex_file in tex_files:
        print(f"Processing: {tex_file}")
        with open(tex_file, 'r', encoding='utf-8') as f:
            tex_content = f.read()
        
        html_content = convert_tex_to_html(tex_content)
        all_html.append(html_content)
    
    # Combine all HTML
    combined_html = '\n\n'.join(all_html)
    
    # Output
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(combined_html)
        print(f"\nConverted content written to {output_file}")
        print(f"You can now copy this content into the <main> tag of your HTML file.")
    else:
        print(combined_html)


if __name__ == '__main__':
    main()
