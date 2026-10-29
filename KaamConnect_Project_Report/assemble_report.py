# -*- coding: utf-8 -*-
"""
assemble_report.py
Master generator for KaamConnect University Project Report:
1. Generates KaamConnect_Project_Report.docx
2. Generates KaamConnect_Project_Report_Source.md
3. Exports KaamConnect_Project_Report.pdf via Microsoft Word COM
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Import modular builders
from make_prelims import build_preliminary_pages
from make_chapter1 import build_chapter1
from make_chapter2 import build_chapter2
from make_chapter3 import build_chapter3
from make_chapter4 import build_chapter4
from make_chapter5 import build_chapter5
from make_references_appendices import build_references_and_appendices

out_dir = os.path.dirname(os.path.abspath(__file__))
img_dir = os.path.join(out_dir, 'screenshots')
docx_path = os.path.join(out_dir, 'KaamConnect_Project_Report.docx')
pdf_path = os.path.join(out_dir, 'KaamConnect_Project_Report.pdf')
md_path = os.path.join(out_dir, 'KaamConnect_Project_Report_Source.md')

print(f"Working Directory: {out_dir}")
print(f"Screenshots Directory: {img_dir}")

doc = docx.Document()

# ----------------- PAGE SETUP (A4, 1-inch margins, 1.25 left for binding) -----------------
section = doc.sections[0]
section.page_width = Inches(8.27)
section.page_height = Inches(11.69)
section.top_margin = Inches(1.0)
section.bottom_margin = Inches(1.0)
section.left_margin = Inches(1.25)
section.right_margin = Inches(1.0)

COLOR_BLACK = RGBColor(0, 0, 0)

# Set Normal style to Times New Roman
style_normal = doc.styles['Normal']
style_normal.font.name = 'Times New Roman'
style_normal.font.size = Pt(12)
style_normal.font.color.rgb = COLOR_BLACK

def set_cell_border(cell, **kwargs):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = parse_xml(r'''
        <w:tcBorders {} >
            <w:top w:val="{}" w:sz="{}" w:space="0" w:color="{}"/>
            <w:left w:val="{}" w:sz="{}" w:space="0" w:color="{}"/>
            <w:bottom w:val="{}" w:sz="{}" w:space="0" w:color="{}"/>
            <w:right w:val="{}" w:sz="{}" w:space="0" w:color="{}"/>
        </w:tcBorders>
    '''.format(
        nsdecls('w'),
        kwargs.get('top', 'single'), kwargs.get('top_sz', '4'), kwargs.get('top_color', 'B0BEC5'),
        kwargs.get('left', 'single'), kwargs.get('left_sz', '4'), kwargs.get('left_color', 'B0BEC5'),
        kwargs.get('bottom', 'single'), kwargs.get('bottom_sz', '4'), kwargs.get('bottom_color', 'B0BEC5'),
        kwargs.get('right', 'single'), kwargs.get('right_sz', '4'), kwargs.get('right_color', 'B0BEC5'),
    ))
    tcPr.append(tcBorders)

def set_cell_background(cell, fill_hex):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def add_chapter_heading(chap_num, chap_name):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(20)
    p.paragraph_format.space_after = Pt(14)
    p.paragraph_format.line_spacing = 1.15
    run1 = p.add_run(f"CHAPTER {chap_num}\n")
    run1.font.name = 'Times New Roman'
    run1.font.size = Pt(16)
    run1.font.bold = True
    run1.font.color.rgb = COLOR_BLACK

    run2 = p.add_run(chap_name.upper())
    run2.font.name = 'Times New Roman'
    run2.font.size = Pt(16)
    run2.font.bold = True
    run2.font.color.rgb = COLOR_BLACK
    return p

def add_prelim_heading(title):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(14)
    run = p.add_run(title.upper())
    run.font.name = 'Times New Roman'
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = COLOR_BLACK
    return p

def add_h1(text, space_before=14, space_after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = COLOR_BLACK
    return p

def add_h2(text, space_before=10, space_after=4):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = COLOR_BLACK
    return p

def add_p(text, line_spacing=1.5, space_after=6, font_size=12, bold=False, italic=False, center=False, justified=True):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if center else (WD_ALIGN_PARAGRAPH.JUSTIFY if justified else WD_ALIGN_PARAGRAPH.LEFT)
    p.paragraph_format.line_spacing = line_spacing
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(0)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = COLOR_BLACK
    return p

def add_bullet(text, bold_prefix='', line_spacing=1.5):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.line_spacing = line_spacing
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.space_before = Pt(0)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_pre = p.add_run(bold_prefix + ' ')
        r_pre.font.name = 'Times New Roman'
        r_pre.font.size = Pt(12)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_BLACK
    r_body = p.add_run(text)
    r_body.font.name = 'Times New Roman'
    r_body.font.size = Pt(12)
    r_body.font.color.rgb = COLOR_BLACK
    return p

def add_image_with_caption(img_path, caption_text, width_inches=5.8):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(width_inches))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(12)
        run_cap = p_cap.add_run(caption_text)
        run_cap.font.name = 'Times New Roman'
        run_cap.font.size = Pt(10)
        run_cap.font.bold = True
        run_cap.font.color.rgb = COLOR_BLACK
    else:
        print(f"Warning: image path does not exist: {img_path}")

print("=== Building Preliminary Pages ===")
build_preliminary_pages(doc, img_dir, add_p, add_prelim_heading, add_image_with_caption)

print("=== Building Chapter 1: Introduction ===")
build_chapter1(doc, add_chapter_heading, add_h1, add_h2, add_p, add_bullet, set_cell_background, set_cell_border)

print("=== Building Chapter 2: Literature Survey ===")
build_chapter2(doc, add_chapter_heading, add_h1, add_h2, add_p, add_bullet, set_cell_background, set_cell_border)

print("=== Building Chapter 3: Design Flow / Process ===")
build_chapter3(doc, img_dir, add_chapter_heading, add_h1, add_h2, add_p, add_bullet, add_image_with_caption, set_cell_background, set_cell_border)

print("=== Building Chapter 4: Results Analysis and Validation ===")
build_chapter4(doc, img_dir, add_chapter_heading, add_h1, add_h2, add_p, add_bullet, add_image_with_caption, set_cell_background, set_cell_border)

print("=== Building Chapter 5: Conclusion and Future Work ===")
build_chapter5(doc, add_chapter_heading, add_h1, add_h2, add_p, add_bullet)

print("=== Building References and Appendices ===")
build_references_and_appendices(doc, add_chapter_heading, add_prelim_heading, add_h1, add_h2, add_p, add_bullet, set_cell_background, set_cell_border)

print(f"Saving Word Document: {docx_path}")
doc.save(docx_path)
print("Word Document saved successfully!")

# Export to PDF via Word COM
print("Converting Word document to PDF using Microsoft Word COM...")
try:
    import win32com.client
    import pythoncom
    pythoncom.CoInitialize()
    word = win32com.client.DispatchEx("Word.Application")
    word.Visible = False
    word.DisplayAlerts = False
    doc_com = word.Documents.Open(docx_path)
    # wdFormatPDF = 17
    doc_com.SaveAs(pdf_path, FileFormat=17)
    doc_com.Close()
    word.Quit()
    print(f"PDF generated successfully at: {pdf_path}")
except Exception as e:
    print(f"Word COM conversion failed: {e}")

print("Assembly complete.")

