# -*- coding: utf-8 -*-
"""
make_prelims.py
Generates the Preliminary Pages strictly following Project Report Format.pdf:
1. Cover Page & Title Page
2. Bonafide Certificate (Double line spacing, 14pt, 'SUPERVISOR' in all caps)
3. Acknowledgement
4. Table of Contents (1.5 line spacing, lowercase Roman numerals)
5. List of Figures (1.5 line spacing)
6. List of Tables (1.5 line spacing)
7. Abstract (1-page synopsis, double line spacing, 14pt)
8. Graphical Abstract (with image)
9. List of Abbreviations, Symbols and Nomenclature
"""

import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def build_preliminary_pages(doc, img_dir, add_p, add_prelim_heading, add_image_with_caption):
    # ========================== 1. TITLE / COVER PAGE ==========================
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(36)
    p_title.paragraph_format.space_after = Pt(12)
    p_title.paragraph_format.line_spacing = 1.2
    run_t = p_title.add_run("KAAMCONNECT: A DIGNIFIED, AI-ENABLED FULL-STACK DOMESTIC WORKER MARKETPLACE\n")
    run_t.font.name = 'Times New Roman'
    run_t.font.size = Pt(16)
    run_t.font.bold = True

    run_tag = p_title.add_run("Your Home. Your Help. One Connection.\n\n")
    run_tag.font.name = 'Times New Roman'
    run_tag.font.size = Pt(13)
    run_tag.font.italic = True

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(24)
    p_sub.paragraph_format.space_after = Pt(24)
    p_sub.paragraph_format.line_spacing = 1.3
    run_sub = p_sub.add_run("A PROJECT REPORT\nSUBMITTED IN PARTIAL FULFILLMENT OF THE REQUIREMENTS\nFOR THE DEGREE OF\n\nBACHELOR OF ENGINEERING\nIN\nCOMPUTER SCIENCE AND ENGINEERING\n\n")
    run_sub.font.name = 'Times New Roman'
    run_sub.font.size = Pt(12)
    run_sub.font.bold = True

    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(18)
    p_by.paragraph_format.space_after = Pt(36)
    p_by.paragraph_format.line_spacing = 1.3
    run_by = p_by.add_run("SUBMITTED BY:\n\nKUMAR SAMRAT SINGH (UID: 24BCS10320)\nSAHIL KUMAR (UID: 24BCS11637)\nKRISH SONU KUMAR (UID: 24BCS11661)\n\n")
    run_by.font.name = 'Times New Roman'
    run_by.font.size = Pt(12)
    run_by.font.bold = True

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(24)
    p_dept.paragraph_format.space_after = Pt(12)
    p_dept.paragraph_format.line_spacing = 1.2
    run_dept = p_dept.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\nCHANDIGARH UNIVERSITY\nOCTOBER 2026")
    run_dept.font.name = 'Times New Roman'
    run_dept.font.size = Pt(12)
    run_dept.font.bold = True

    doc.add_page_break()

    # ========================== 2. BONAFIDE CERTIFICATE ==========================
    add_prelim_heading("BONAFIDE CERTIFICATE")

    cert_text = (
        "Certified that this project report titled \"KAAMCONNECT: A DIGNIFIED, AI-ENABLED "
        "FULL-STACK DOMESTIC WORKER MARKETPLACE\" is the bonafide work of KUMAR SAMRAT SINGH "
        "(UID: 24BCS10320), SAHIL KUMAR (UID: 24BCS11637), and KRISH SONU KUMAR (UID: 24BCS11661) "
        "who carried out the project work under my supervision in partial fulfillment of the requirements for "
        "the award of the degree of Bachelor of Engineering in Computer Science and Engineering."
    )
    add_p(cert_text, line_spacing=2.0, font_size=14, space_after=36)

    # Signatures
    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(36)
    p_sig.paragraph_format.space_after = Pt(6)
    p_sig.paragraph_format.line_spacing = 1.5

    table_sig = doc.add_table(rows=1, cols=2)
    table_sig.autofit = True
    cell_l, cell_r = table_sig.rows[0].cells
    cell_l.width = Inches(3.2)
    cell_r.width = Inches(3.2)

    p_l = cell_l.paragraphs[0]
    p_l.paragraph_format.line_spacing = 1.3
    r_l = p_l.add_run("SIGNATURE\n\n\n\nEr. Venkatesh K\nSUPERVISOR\nDepartment of Computer Science & Engineering\nChandigarh University")
    r_l.font.name = 'Times New Roman'
    r_l.font.size = Pt(12)
    r_l.font.bold = True

    p_r = cell_r.paragraphs[0]
    p_r.paragraph_format.line_spacing = 1.3
    r_r = p_r.add_run("SIGNATURE\n\n\n\nDr. Sandeep Singh Kang\nHEAD OF THE DEPARTMENT\nDepartment of Computer Science & Engineering\nChandigarh University")
    r_r.font.name = 'Times New Roman'
    r_r.font.size = Pt(12)
    r_r.font.bold = True

    doc.add_page_break()

    # ========================== 3. ACKNOWLEDGEMENT ==========================
    add_prelim_heading("ACKNOWLEDGEMENT")
    add_p(
        "First and foremost, we express our profound gratitude to our project supervisor, Er. Venkatesh K, "
        "Department of Computer Science and Engineering, for their invaluable guidance, "
        "encouraging critique, and constant technical mentorship throughout the design and realization of KaamConnect.",
        line_spacing=1.5
    )
    add_p(
        "We are deeply thankful to Dr. Sandeep Singh Kang, Head of the Department of Computer Science and Engineering, for "
        "providing the computational infrastructure, departmental facilities, and academic environment essential for completing this work.",
        line_spacing=1.5
    )
    add_p(
        "We also extend our sincere appreciation to the faculty members and technical laboratory staff of the department "
        "for their constructive feedback during project evaluations. Special thanks are due to our families and colleagues "
        "whose unwavering moral support motivated our efforts. Finally, we thank each other for cohesive teamwork, dedication, "
        "and collaborative problem-solving that made this full-stack engineering endeavor a reality.",
        line_spacing=1.5
    )

    p_ack_names = doc.add_paragraph()
    p_ack_names.paragraph_format.space_before = Pt(24)
    p_ack_names.paragraph_format.line_spacing = 1.3
    r_names = p_ack_names.add_run("Kumar Samrat Singh (24BCS10320)\nSahil Kumar (24BCS11637)\nKrish Sonu Kumar (24BCS11661)")
    r_names.font.name = 'Times New Roman'
    r_names.font.size = Pt(12)
    r_names.font.bold = True

    doc.add_page_break()

    # ========================== 4. TABLE OF CONTENTS ==========================
    add_prelim_heading("TABLE OF CONTENTS")
    
    toc_data = [
        ("ACKNOWLEDGEMENT", "iii"),
        ("LIST OF FIGURES", "vi"),
        ("LIST OF TABLES", "vii"),
        ("ABSTRACT", "viii"),
        ("GRAPHICAL ABSTRACT", "ix"),
        ("LIST OF ABBREVIATIONS, SYMBOLS AND NOMENCLATURE", "x"),
        ("CHAPTER 1: INTRODUCTION", "1"),
        ("    1.1. Introduction to KaamConnect", "1"),
        ("    1.2. Background of the Project", "2"),
        ("    1.3. Identification of Client and Need", "3"),
        ("    1.4. Relevant Contemporary Issues", "4"),
        ("    1.5. Problem Identification", "5"),
        ("    1.6. Existing System and Its Limitations", "6"),
        ("    1.7. Proposed System (KaamConnect)", "7"),
        ("    1.8. Task Identification and Modular Decomposition", "8"),
        ("    1.9. Project Scope and Operating Boundaries", "9"),
        ("    1.10. Project Timeline and Milestone Schedule", "10"),
        ("    1.11. Organization of the Report", "11"),
        ("CHAPTER 2: LITERATURE SURVEY", "12"),
        ("    2.1. Overview of Domestic Gig Marketplaces", "12"),
        ("    2.2. Survey of Existing Commercial Solutions", "13"),
        ("    2.3. Historical Timeline of the Reported Problem", "15"),
        ("    2.4. Bibliometric Synthesis of Contemporary Research", "16"),
        ("    2.5. Comparative Study Matrix", "18"),
        ("    2.6. Synthesis Linking Literature Review with KaamConnect", "19"),
        ("    2.7. Problem Definition", "20"),
        ("    2.8. Project Goals and Technical Objectives", "20"),
        ("CHAPTER 3: DESIGN FLOW / PROCESS", "22"),
        ("    3.1. Concept Generation & Feature Specification", "22"),
        ("    3.2. Requirement Analysis (Functional & Non-Functional)", "23"),
        ("    3.3. Multi-Dimensional Design Constraints", "25"),
        ("    3.4. Architectural Design Alternatives Analysis", "27"),
        ("    3.5. Comparative Evaluation and Best Design Justification", "29"),
        ("    3.6. Three-Tier System Architecture", "31"),
        ("    3.7. Database Modeling & Entity Relationship Design", "33"),
        ("    3.8. Use-Case Modeling and Platform Actors", "36"),
        ("    3.9. Data Flow Modeling (Level-0 and Level-1 DFD)", "38"),
        ("    3.10. Sequence & Lifecycle Interaction Modeling", "40"),
        ("    3.11. Core Operational Algorithms and Logic Flowcharts", "42"),
        ("CHAPTER 4: RESULTS ANALYSIS AND VALIDATION", "45"),
        ("    4.1. Development and Runtime Environment Specifications", "45"),
        ("    4.2. Implementation Using Modern Engineering Tools", "46"),
        ("    4.3. Module-by-Module Technical Implementation", "47"),
        ("    4.4. Production Cloud Deployment Architecture", "52"),
        ("    4.5. Comprehensive Test Execution & Verification Suite", "54"),
        ("    4.6. Quantitative Performance Analysis & Empirical Validation", "58"),
        ("    4.7. Actual Application Interface Evidence & Screenshots", "60"),
        ("CHAPTER 5: CONCLUSION AND FUTURE WORK", "70"),
        ("    5.1. Project Conclusion", "70"),
        ("    5.2. Fulfillment of Project Objectives", "71"),
        ("    5.3. Major Technical Contributions", "72"),
        ("    5.4. Deviations from Expected Results & System Limitations", "73"),
        ("    5.5. Challenges Encountered & Engineering Solutions", "74"),
        ("    5.6. Future Enhancements & Strategic Roadmap", "75"),
        ("REFERENCES", "77"),
        ("APPENDIX 1: USER MANUAL (STEP-BY-STEP OPERATIONAL GUIDE)", "80"),
        ("APPENDIX 2: REST API ENDPOINTS SPECIFICATION", "88"),
        ("APPENDIX 3: COMPLETE MONGODB SCHEMA STRUCTURES", "91"),
        ("APPENDIX 4: LOCAL DEPLOYMENT & INSTALLATION INSTRUCTIONS", "94"),
        ("APPENDIX 5: COMPREHENSIVE TEST CASE DETAILS", "96"),
        ("APPENDIX 6: PROJECT ACHIEVEMENTS AND MILESTONES", "99")
    ]

    t_toc = doc.add_table(rows=len(toc_data), cols=2)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_toc.autofit = False

    for i, (title_str, p_num) in enumerate(toc_data):
        c_l, c_r = t_toc.rows[i].cells
        c_l.width = Inches(5.6)
        c_r.width = Inches(0.8)
        
        p_l = c_l.paragraphs[0]
        p_l.paragraph_format.line_spacing = 1.3
        p_l.paragraph_format.space_after = Pt(2)
        r_l = p_l.add_run(title_str)
        r_l.font.name = 'Times New Roman'
        r_l.font.size = Pt(11)
        if title_str.startswith("CHAPTER") or title_str.isupper():
            r_l.font.bold = True

        p_r = c_r.paragraphs[0]
        p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_r.paragraph_format.line_spacing = 1.3
        p_r.paragraph_format.space_after = Pt(2)
        r_r = p_r.add_run(p_num)
        r_r.font.name = 'Times New Roman'
        r_r.font.size = Pt(11)
        if title_str.startswith("CHAPTER") or title_str.isupper():
            r_r.font.bold = True

    doc.add_page_break()

    # ========================== 5. LIST OF FIGURES ==========================
    add_prelim_heading("LIST OF FIGURES")

    figures_data = [
        ("Figure 0.1", "Graphical Abstract of the KaamConnect Platform Architecture", "ix"),
        ("Figure 3.1", "Three-Tier Client-Server Architecture of KaamConnect", "32"),
        ("Figure 3.2", "MongoDB Entity-Relationship Schema Diagram", "35"),
        ("Figure 3.3", "Use-Case Diagram for Customer, Worker Partner, and Administrator", "37"),
        ("Figure 3.4", "Level-1 Data Flow Diagram (DFD) of KaamConnect Subsystems", "39"),
        ("Figure 3.5", "Sequence Diagram for Booking Lifecycle & Dual-OTP Verification", "41"),
        ("Figure 4.1", "KaamConnect Rebranded Landing Page with AI Search Prompts", "61"),
        ("Figure 4.2", "User Authentication Interface with 1-Click Role Demofills", "62"),
        ("Figure 4.3", "Dual-Role User Registration Interface with Intent Selection", "63"),
        ("Figure 4.4", "Worker Discovery & Filtering Interface with Natural Language AI Parser", "64"),
        ("Figure 4.5", "Customer Portal Dashboard with Active Service Trackers", "65"),
        ("Figure 4.6", "Customer Bookings Management Interface with Arrival Start-OTP Badge", "66"),
        ("Figure 4.7", "Worker Partner Dashboard with Instant Availability Toggle & Earnings", "67"),
        ("Figure 4.8", "Worker Job Assignment Manager with OTP Verification Trigger", "68"),
        ("Figure 4.9", "Administrator Control Center with Real-Time Operational Analytics", "69"),
        ("Figure 4.10", "Bi-Directional Real-Time Messaging Interface via Socket.IO", "70")
    ]

    t_figs = doc.add_table(rows=len(figures_data)+1, cols=3)
    t_figs.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header
    c0, c1, c2 = t_figs.rows[0].cells
    c0.width, c1.width, c2.width = Inches(1.3), Inches(4.5), Inches(0.8)
    for c, txt in [(c0, "Figure No."), (c1, "Figure Caption / Title"), (c2, "Page No.")]:
        p = c.paragraphs[0]
        r = p.add_run(txt)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        set_cell_background(c, "F1F5F9")

    for i, (f_num, f_cap, p_num) in enumerate(figures_data):
        row_cells = t_figs.rows[i+1].cells
        row_cells[0].width, row_cells[1].width, row_cells[2].width = Inches(1.3), Inches(4.5), Inches(0.8)
        
        p0 = row_cells[0].paragraphs[0]
        r0 = p0.add_run(f_num)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(11)
        r0.font.bold = True

        p1 = row_cells[1].paragraphs[0]
        r1 = p1.add_run(f_cap)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)

        p2 = row_cells[2].paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r2 = p2.add_run(p_num)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11)

    doc.add_page_break()

    # ========================== 6. LIST OF TABLES ==========================
    add_prelim_heading("LIST OF TABLES")

    tables_data = [
        ("Table 1.1", "KaamConnect Engineering Milestone and Development Timeline", "10"),
        ("Table 2.1", "Comparative Analysis of Domestic Work Platforms vs. KaamConnect", "18"),
        ("Table 3.1", "Architectural Trade-Off Matrix for System Design Selection", "30"),
        ("Table 4.1", "Comprehensive System Test Execution and Verification Suite", "55"),
        ("Table 4.2", "Frontend and Backend Empirical Runtime Performance Benchmarks", "59"),
        ("Table A2.1", "Master RESTful API Endpoints Specification", "88")
    ]

    t_tbls = doc.add_table(rows=len(tables_data)+1, cols=3)
    t_tbls.alignment = WD_TABLE_ALIGNMENT.CENTER
    c0, c1, c2 = t_tbls.rows[0].cells
    c0.width, c1.width, c2.width = Inches(1.3), Inches(4.5), Inches(0.8)
    for c, txt in [(c0, "Table No."), (c1, "Table Title / Caption"), (c2, "Page No.")]:
        p = c.paragraphs[0]
        r = p.add_run(txt)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        set_cell_background(c, "F1F5F9")

    for i, (t_num, t_cap, p_num) in enumerate(tables_data):
        row_cells = t_tbls.rows[i+1].cells
        row_cells[0].width, row_cells[1].width, row_cells[2].width = Inches(1.3), Inches(4.5), Inches(0.8)

        p0 = row_cells[0].paragraphs[0]
        r0 = p0.add_run(t_num)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(11)
        r0.font.bold = True

        p1 = row_cells[1].paragraphs[0]
        r1 = p1.add_run(t_cap)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)

        p2 = row_cells[2].paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r2 = p2.add_run(p_num)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11)

    doc.add_page_break()

    # ========================== 7. ABSTRACT ==========================
    add_prelim_heading("ABSTRACT")

    abstract_text = (
        "The domestic services sector in urban India represents one of the largest unorganized employment segments, "
        "encompassing millions of domestic helpers, cooks, babysitters, and caregivers. However, the ecosystem remains severely "
        "compromised by predatory brokerage syndicates charging exorbitant commissions (up to 50%), total absence of authentic "
        "background identity screening, lack of wage transparency, and complete lack of technical dispute resolution mechanisms. "
        "This project presents KaamConnect (\"Your Home. Your Help. One Connection.\"), a full-stack engineering solution architected "
        "to bring dignity, security, and algorithmic transparency to the domestic service marketplace.\n\n"
        "KaamConnect is engineered on the decoupled MERN stack (MongoDB Atlas, Express.js, React 18, and Node.js) with production-grade "
        "cloud deployment on Vercel and Render. The platform incorporates four fundamental engineering innovations: (1) a Zero-Middleman "
        "Direct Compensation Engine guaranteeing that domestic helpers retain 100% of their quoted wages; (2) a Multi-Tier Identity and "
        "Police Screening Protocol supporting government Aadhaar biometric verification and physical address clearance; (3) a Dual-OTP "
        "Arrival & Completion Authentication Workflow, where service execution begins only when the customer releases a 4-digit startOtp on-site, "
        "eliminating phantom attendance and wage fraud; and (4) an Integrated Gemini 1.5 Flash AI Semantic Requirement Parser, translating "
        "unstructured natural-language household needs (such as regional cuisines, elderly patient care, and dietary constraints) into structured "
        "database query filters. Furthermore, a bi-directional real-time messaging gateway powered by Socket.IO facilitates secure pre-booking communication.\n\n"
        "Extensive empirical testing was conducted across all operational pathways. End-to-end integration tests demonstrated sub-120ms API response "
        "latencies, 100% test-case compliance across 15 verification scenarios, and successful real-time state synchronization across desktop and mobile devices. "
        "The platform establishes a reproducible, scalable paradigm for empowering informal domestic workers while providing households with dependable, verified home care."
    )
    # Strictly double line spacing and 14pt as mandated by university guideline
    add_p(abstract_text, line_spacing=2.0, font_size=14)

    doc.add_page_break()

    # ========================== 8. GRAPHICAL ABSTRACT ==========================
    add_prelim_heading("GRAPHICAL ABSTRACT")

    add_p(
        "The Graphical Abstract illustrated in Figure 0.1 provides a high-level visual synopsis of the multi-tier architectural flow "
        "of the KaamConnect platform. It highlights the seamless interaction between platform actors (Customers, Worker Partners, and Administrators), "
        "the client-side presentation layer (React 18 SPA), the server application layer (Node.js/Express REST gateway), the real-time communication "
        "and AI services (Socket.IO, Google Gemini 1.5, Cloudinary CDN), and the managed persistence tier (MongoDB Atlas replica set).",
        line_spacing=1.5
    )

    ga_path = os.path.join(img_dir, 'fig_graphical_abstract.png')
    add_image_with_caption(ga_path, "Figure 0.1: Graphical Abstract of the KaamConnect Platform Architecture", width_inches=6.2)

    doc.add_page_break()

    # ========================== 9. ABBREVIATIONS & NOMENCLATURE ==========================
    add_prelim_heading("LIST OF ABBREVIATIONS, SYMBOLS AND NOMENCLATURE")

    abbreviations = [
        ("API", "Application Programming Interface"),
        ("CORS", "Cross-Origin Resource Sharing"),
        ("CSS", "Cascading Style Sheets"),
        ("DFD", "Data Flow Diagram"),
        ("DOM", "Document Object Model"),
        ("ERD", "Entity-Relationship Diagram"),
        ("HTML", "HyperText Markup Language"),
        ("HTTP / HTTPS", "HyperText Transfer Protocol (Secure)"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("KYC", "Know Your Customer (Government ID Verification)"),
        ("MERN", "MongoDB, Express.js, React.js, Node.js"),
        ("NLP", "Natural Language Processing"),
        ("NoSQL", "Not Only Structured Query Language (Document Database)"),
        ("ODM", "Object Document Mapper"),
        ("OTP", "One-Time Password (4-Digit Cryptographic Code)"),
        ("REST", "Representational State Transfer"),
        ("SPA", "Single Page Application"),
        ("SSL / TLS", "Secure Sockets Layer / Transport Layer Security"),
        ("UIDAI", "Unique Identification Authority of India (Aadhaar)"),
        ("UI / UX", "User Interface / User Experience"),
        ("URI / URL", "Uniform Resource Identifier / Locator"),
        ("WSS", "WebSocket Secure (Bi-directional Socket Protocol)")
    ]

    t_abbr = doc.add_table(rows=len(abbreviations)+1, cols=2)
    t_abbr.alignment = WD_TABLE_ALIGNMENT.CENTER
    c0, c1 = t_abbr.rows[0].cells
    c0.width, c1.width = Inches(2.0), Inches(4.5)
    for c, txt in [(c0, "Abbreviation / Symbol"), (c1, "Full Form / Definition")]:
        p = c.paragraphs[0]
        r = p.add_run(txt)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        set_cell_background(c, "F1F5F9")

    for i, (short_s, long_s) in enumerate(abbreviations):
        row_cells = t_abbr.rows[i+1].cells
        row_cells[0].width, row_cells[1].width = Inches(2.0), Inches(4.5)

        p0 = row_cells[0].paragraphs[0]
        r0 = p0.add_run(short_s)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(11)
        r0.font.bold = True

        p1 = row_cells[1].paragraphs[0]
        r1 = p1.add_run(long_s)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)

    doc.add_page_break()
    print('Preliminary pages built successfully.')
