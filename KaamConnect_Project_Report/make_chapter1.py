# -*- coding: utf-8 -*-
"""
make_chapter1.py
Constructs Chapter 1: INTRODUCTION strictly adhering to Project Report Format.pdf:
- Times New Roman throughout
- Heading 1: 14pt Bold Left Aligned
- Heading 2: 12pt Bold Left Aligned
- Body text: 12pt Justified, 1.5 line spacing
- Chapter Title: 16pt Bold Centered
- Table 1.1 formatted with 10pt Bold caption and styled headers
"""

import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def build_chapter1(doc, add_chapter_heading, add_h1, add_h2, add_p, add_bullet, set_cell_background, set_cell_border):
    add_chapter_heading(1, "INTRODUCTION")

    # 1.1 Introduction to KaamConnect
    add_h1("1.1. Introduction to KaamConnect")
    add_p(
        "KaamConnect, bearing the defining tagline \"Your Home. Your Help. One Connection.\", is an advanced full-stack "
        "digital ecosystem engineered to bridge the profound socio-technical divide between urban households and informal "
        "domestic service professionals. In contemporary urban metropolises, households rely heavily on domestic help for daily "
        "sustenance—including cooking, home sanitation, child care, and elderly assistance. Despite this indispensability, "
        "the market remains fraught with fragmented information, unpredictable compensation, safety anxieties, and exploitative "
        "middlemen who levy exorbitant cuts on vulnerable laborers."
    )
    add_p(
        "KaamConnect re-engineers this relationship from the ground up by deploying a dignified, transparent, and direct "
        "peer-to-peer web platform built upon the high-performance MERN architecture (MongoDB Atlas, Express.js, React 18, and Node.js). "
        "By eliminating predatory intermediary commissions, instituting biometric and police-verified Know Your Customer (KYC) "
        "protocols, enforcing a novel Dual-OTP on-site attendance verification workflow, and integrating Google Gemini 1.5 Flash "
        "artificial intelligence for natural language service discovery, KaamConnect provides an empowering technological foundation "
        "where domestic workers work with dignity and urban households hire with complete peace of mind."
    )

    # 1.2 Background of the Project
    add_h1("1.2. Background of the Project")
    add_p(
        "The domestic labor sector in India is among the largest single sources of informal urban employment, engaging an estimated "
        "50 million individuals, predominantly women and interstate migrants. Rapid macroeconomic shifts over the past two decades—characterized "
        "by accelerated urban migration, the proliferation of nuclear and dual-income family structures, and high-pressure corporate work "
        "schedules—have transformed domestic help from an occasional luxury into an absolute household necessity."
    )
    add_p(
        "Historically, domestic labor recruitment has relied on informal word-of-mouth networks, residential security guard referrals, or "
        "unregulated neighborhood brokers. These archaic channels suffer from severe structural deficiencies: workers are forced to surrender "
        "up to half of their first month's wages to agents; households have no objective means to verify the criminal or personal background "
        "of workers entering their private sanctuaries; and no formal records exist to document agreed wages, duty hours, or service scopes. "
        "The advent of modern web engineering frameworks and ubiquitous mobile broadband presents an unprecedented opportunity to "
        "formalize this massive unorganized economy through an equitable software solution."
    )

    # 1.3 Identification of Client and Need
    add_h1("1.3. Identification of Client and Need")
    add_p(
        "The development of KaamConnect addresses two core stakeholder constituencies whose mutual needs have been chronically underserved "
        "by conventional market dynamics:"
    )
    add_bullet(
        "Working professionals, dual-income couples, senior citizens, and young families residing in metropolitan and suburban "
        "regions. Their critical requirements include rapid on-demand discovery of vetted service professionals, transparent pricing without hidden "
        "agent markups, verifiable identity credentials (Aadhaar/Police clearance), secure payment settlement, and guaranteed punctual service delivery.",
        bold_prefix="1. Urban Household Clients (Customers):"
    )
    add_bullet(
        "Informal domestic professionals specializing in maid services, specialized cooking, infant and childcare, elderly assistance, "
        "laundry, and gardening. Their fundamental needs include financial inclusion, zero-commission wage retention, protection against arbitrary dismissal, "
        "direct transparent communication with employers, and autonomous control over their daily schedules and hourly tariff structures.",
        bold_prefix="2. Domestic Service Partners (Workers):"
    )
    add_bullet(
        "Platform compliance officers and support operators requiring granular oversight over user verification, automated dispute "
        "resolution logs, real-time booking statuses, and platform transaction metrics without incurring manual operational bottlenecks.",
        bold_prefix="3. Platform Governance (Administrators):"
    )

    # 1.4 Relevant Contemporary Issues
    add_h1("1.4. Relevant Contemporary Issues")
    add_p(
        "The informal gig economy has garnered intense academic and policy scrutiny worldwide. Within the domestic work sphere, several pressing "
        "contemporary issues underscore the urgency of KaamConnect's engineering interventions:"
    )
    add_bullet(
        "Conventional commercial gig aggregators take advantage of worker desperation by levying 25% to 40% platform service "
        "fees on every completed gig, driving domestic helpers into algorithmic wage suppression and economic vulnerability.",
        bold_prefix="Algorithmic Exploitation and Predatory Commissions:"
    )
    add_bullet(
        "With increasing instances of residential theft and safety breaches reported in high-density urban apartments, "
        "households demand verified identification. Conversely, workers frequently face false accusations and lack verifiable digital records of their presence.",
        bold_prefix="Safety Deficit and Asymmetric Trust:"
    )
    add_bullet(
        "Domestic helpers often lack formal literacy in English or complex bureaucratic user interfaces. Traditional "
        "platforms designed with intricate nested menus alienate both non-technical workers and elderly citizens seeking specialized care.",
        bold_prefix="Digital Exclusion of Semi-Literate Labor:"
    )
    add_bullet(
        "Informal arrangements lack auditability. Disputes regarding arrival times, actual hours worked, "
        "or sudden cancellations lead to bitter confrontations and immediate worker termination without compensation.",
        bold_prefix="Lack of Service Audit Trails and Verification:"
    )

    # 1.5 Problem Identification
    add_h1("1.5. Problem Identification")
    add_p(
        "A rigorous investigation into contemporary urban domestic labor workflows reveals three fatal bottlenecks in the informal status quo:"
    )
    add_bullet(
        "Neither employer nor employee possesses verified institutional data. Employers rely on subjective impressions, while "
        "workers have no portable reputation or verified portfolio to command fair market compensation.",
        bold_prefix="Absence of Cryptographic Verification:"
    )
    add_bullet(
        "Unregistered local labor brokers extract parasitic economic rents without offering guarantees, customer support, or "
        "safety indemnities to either party.",
        bold_prefix="Rent-Seeking Brokerage Syndicates:"
    )
    add_bullet(
        "A chronic issue in home services is 'phantom attendance'—where service workers claim to have arrived but never performed "
        "the task, or conversely, where clients claim a worker failed to attend despite full physical service delivery. Without an objective cryptographic "
        "handshake on arrival, dispute resolution remains subjective and irreconcilable.",
        bold_prefix="Physical Service Attendance Ambiguity:"
    )

    # 1.6 Existing System and Its Limitations
    add_h1("1.6. Existing System and Its Limitations")
    add_p(
        "Existing solutions can be broadly categorized into two models, each exhibiting fatal operational deficiencies:"
    )
    add_p(
        "1. Informal Offline Networks (Brokers & Word-of-Mouth): Characterized by zero background screening, zero safety guarantees, zero wage standard, "
        "and geographical lock-in. A household moving into a new locality spends weeks attempting to find reliable help through compound security guards.\n\n"
        "2. Corporate Aggregator Platforms (e.g., Urban Company): While these platforms offer centralized mobile booking, their business model focuses heavily "
        "on one-off technical maintenance (air conditioning repair, plumbing, salon services) rather than recurring, dignified daily domestic relationships. "
        "Crucially, corporate aggregators operate on high commission takes (often exceeding 25%), impose rigid algorithmic penalties on workers, prohibit direct "
        "customer-worker relationship building, and charge clients inflated booking surcharges."
    )

    # 1.7 Proposed System (KaamConnect)
    add_h1("1.7. Proposed System (KaamConnect)")
    add_p(
        "KaamConnect fundamentally departs from both exploitative models by introducing a decoupled, highly resilient MERN-based web ecosystem. "
        "The core pillars of the proposed system comprise:"
    )
    add_bullet(
        "KaamConnect imposes 0% commission on worker earnings. Workers retain 100% of their negotiated hourly/monthly rates, "
        "fostering genuine worker loyalty, self-determination, and honest pricing.",
        bold_prefix="Zero-Commission Direct Model:"
    )
    add_bullet(
        "Worker registrations require submission of government-issued Aadhaar credentials, address documentation, and optional "
        "police clearance, strictly verified via the Administrator Governance Portal.",
        bold_prefix="Government-Verified Worker Profiles:"
    )
    add_bullet(
        "To guarantee indisputable physical verification, when a worker partner arrives at a customer's residence, the customer "
        "provides a unique, time-sensitive 4-digit 'startOtp' generated in their dashboard. The worker enters this OTP into their interface to transition "
        "the booking into 'in-progress'. A corresponding completion workflow guarantees authentic execution prior to final payment settlement.",
        bold_prefix="Cryptographic Dual-OTP Arrival & Completion Protocol:"
    )
    add_bullet(
        "Households can search for workers using intuitive, colloquial natural language queries (e.g., 'Need a gentle vegetarian South Indian cook "
        "who can handle diabetic meals in Indiranagar'). Google's Gemini 1.5 Flash API parses these unstructured prompts into structured database filters.",
        bold_prefix="AI-Powered Semantic Requirement Parser:"
    )
    add_bullet(
        "Integrated WebSocket gateway providing instant, end-to-end communication between clients and workers for schedule coordination.",
        bold_prefix="Real-Time In-App Messaging:"
    )

    # 1.8 Task Identification and Modular Decomposition
    add_h1("1.8. Task Identification and Modular Decomposition")
    add_p(
        "To systematically execute the engineering objectives of KaamConnect, the system architecture was decomposed into six cohesive, "
        "decoupled functional modules:"
    )
    add_bullet(
        "Implementation of dual JWT token architecture (access tokens with short lifespans and HTTP-only refresh tokens), "
        "bcrypt-based password hashing (salt rounds = 10), role-based route guards (Customer, Worker, Admin), and CORS security policies.",
        bold_prefix="Module 1 - Authentication, Authorization & Security Engine:"
    )
    add_bullet(
        "Worker onboarding with Cloudinary document/profile image pipeline, dynamic availability toggling, "
        "hourly rate configuration, skills categorization, and earnings ledger.",
        bold_prefix="Module 2 - Worker Partner Lifecycle & Profile Engine:"
    )
    add_bullet(
        "Worker discovery, faceted filtering, Gemini AI search modal, booking checkout flow, active service tracking, "
        "and ratings/reviews submission.",
        bold_prefix="Module 3 - Customer Experience & Booking Management:"
    )
    add_bullet(
        "State machine governing booking transitions (pending -> confirmed -> in-progress -> completed -> cancelled), "
        "cryptographic generation of 4-digit OTPs, and verification validation routines.",
        bold_prefix="Module 4 - Dual-OTP Execution & Verification Core:"
    )
    add_bullet(
        "Socket.IO connection manager, room join/leave events, message persistence in MongoDB, unread counter badges, "
        "and instantaneous state broadcasts.",
        bold_prefix="Module 5 - Bi-Directional Real-Time Messaging Gateway:"
    )
    add_bullet(
        "Centralized administrative dashboard displaying active platform statistics, KYC pending queues with single-click "
        "approve/reject controls, user bans, and platform-wide booking audit logs.",
        bold_prefix="Module 6 - Administrator Governance & Analytics Dashboard:"
    )

    # 1.9 Project Scope and Operating Boundaries
    add_h1("1.9. Project Scope and Operating Boundaries")
    add_p(
        "Defining unambiguous functional boundaries is critical for rigorous software engineering evaluation. The operational scope of "
        "KaamConnect is demarcated as follows:"
    )
    add_bullet(
        "Domestic cleaning, deep house sanitation, home cooking, elderly companion care, babysitting and infant care, "
        "laundry services, and urban gardening.",
        bold_prefix="Supported Service Categories:"
    )
    add_bullet(
        "Desktop, tablet, and mobile browsers through a fully responsive React 18 single-page application communicating "
        "over secure HTTPS and WSS protocols.",
        bold_prefix="Target Platform Scope:"
    )
    add_bullet(
        "Automated direct banking payroll processing, international fiat currency conversions, and automated physical "
        "police record scraping (which is constrained by government portal CAPTCHA and privacy firewalls; handled via manual admin review).",
        bold_prefix="Explicit Out-of-Scope Elements:"
    )

    # 1.10 Project Timeline and Milestone Schedule
    add_h1("1.10. Project Timeline and Milestone Schedule")
    add_p(
        "The KaamConnect platform was engineered across an intensive multi-month lifecycle spanning research, architecture design, "
        "backend development, frontend component engineering, real-time integration, automated testing, and production cloud deployment. "
        "Table 1.1 documents the comprehensive project milestone schedule."
    )

    # TABLE 1.1
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(8)
    p_cap.paragraph_format.space_after = Pt(4)
    r_cap = p_cap.add_run("Table 1.1: KaamConnect Engineering Milestone and Development Timeline")
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(10)
    r_cap.font.bold = True

    timeline_data = [
        ("Phase I", "Literature Review & Requirements Engineering", "Weeks 1 - 2", "Requirement Specification, Problem Definition, Competitor Benchmarking", "Completed"),
        ("Phase II", "System Architecture & Schema Modeling", "Weeks 3 - 4", "DFD diagrams, ER diagrams, MongoDB Atlas Cluster setup, API contract design", "Completed"),
        ("Phase III", "Backend Core & Security Implementation", "Weeks 5 - 7", "Node.js/Express REST API, JWT auth, OTP algorithms, Cloudinary media pipeline", "Completed"),
        ("Phase IV", "Frontend Development & UI/UX Design", "Weeks 8 - 10", "React 18 SPA, Tailwind CSS, Lucide icons, Customer/Worker/Admin role dashboards", "Completed"),
        ("Phase V", "Real-Time Chat & Gemini AI Integration", "Weeks 11 - 12", "Socket.IO WSS rooms, Google Gemini 1.5 Flash natural language prompt engine", "Completed"),
        ("Phase VI", "Integration Testing & Cloud Deployment", "Weeks 13 - 14", "Selenium end-to-end test suite, Vercel frontend, Render backend, Atlas replica set", "Completed"),
        ("Phase VII", "Documentation & Performance Audit", "Weeks 15 - 16", "University report compilation, Lighthouse audit, production bug fixes", "Completed")
    ]

    table = doc.add_table(rows=len(timeline_data)+1, cols=5)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_widths = [Inches(0.9), Inches(2.2), Inches(1.1), Inches(1.9), Inches(0.9)]

    # Header Row
    headers = ["Milestone", "Development Phase / Activity", "Timeline", "Key Engineering Deliverables", "Status"]
    for j, h_text in enumerate(headers):
        cell = table.rows[0].cells[j]
        cell.width = col_widths[j]
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(h_text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.font.bold = True
        set_cell_background(cell, "E2E8F0")
        set_cell_border(cell)

    # Data Rows
    for i, row in enumerate(timeline_data):
        for j, val in enumerate(row):
            cell = table.rows[i+1].cells[j]
            cell.width = col_widths[j]
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if j in [0, 2, 4] else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.15
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)
            if j == 4:
                r.font.bold = True
            set_cell_border(cell)

    # 1.11 Organization of the Report
    add_h1("1.11. Organization of the Report")
    add_p(
        "This project report is structured systematically into five cohesive chapters, followed by academic references and comprehensive technical appendices:"
    )
    add_bullet(
        "Establishes the motivation, social and economic background, client identification, problem formulation, "
        "proposed system philosophy, task decomposition, operational scope, and milestone timeline.",
        bold_prefix="Chapter 1 (Introduction):"
    )
    add_bullet(
        "Synthesizes contemporary literature on gig work platforms, evaluates existing commercial solutions, constructs "
        "a comparative feature matrix, and crystallizes the specific engineering objectives of KaamConnect.",
        bold_prefix="Chapter 2 (Literature Survey):"
    )
    add_bullet(
        "Details system concept generation, functional and non-functional requirements, regulatory and ethical design "
        "constraints, architectural alternatives analysis, three-tier architecture, MongoDB schema modeling, UML use-case diagrams, data flow diagrams, "
        "sequence diagrams, and mathematical/operational algorithms.",
        bold_prefix="Chapter 3 (Design Flow / Process):"
    )
    add_bullet(
        "Documents the runtime toolchain, module-by-module implementation details, cloud deployment topology, comprehensive "
        "15-case test execution suite, empirical performance latency benchmarks, and actual application interface screenshots captured from production.",
        bold_prefix="Chapter 4 (Results Analysis and Validation):"
    )
    add_bullet(
        "Summarizes the engineering outcomes, evaluates fulfillment of technical objectives, outlines limitations and mitigation "
        "strategies, and projects a strategic roadmap for future enhancements.",
        bold_prefix="Chapter 5 (Conclusion and Future Work):"
    )
    add_bullet(
        "Alphabetically cataloged academic literature, followed by six technical appendices including an end-to-end User Manual, "
        "REST API endpoints specification, complete MongoDB schemas, local setup instructions, test case details, and project achievements.",
        bold_prefix="References and Appendices:"
    )

    doc.add_page_break()
    print("Chapter 1 written successfully.")

