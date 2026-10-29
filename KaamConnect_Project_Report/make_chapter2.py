# -*- coding: utf-8 -*-
"""
make_chapter2.py
Constructs Chapter 2: LITERATURE SURVEY strictly adhering to Project Report Format.pdf:
- Times New Roman throughout
- Heading 1: 14pt Bold Left Aligned
- Heading 2: 12pt Bold Left Aligned
- Body text: 12pt Justified, 1.5 line spacing
- Chapter Title: 16pt Bold Centered
- Table 2.1 formatted with 10pt Bold caption and styled headers
"""

import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def build_chapter2(doc, add_chapter_heading, add_h1, add_h2, add_p, add_bullet, set_cell_background, set_cell_border):
    add_chapter_heading(2, "LITERATURE SURVEY")

    # 2.1 Overview of Domestic Gig Marketplaces
    add_h1("2.1. Overview of Domestic Gig Marketplaces")
    add_p(
        "The digital platformization of informal labor represents one of the most transformative socio-economic developments "
        "of the twenty-first century. As observed by the International Labour Organization (ILO, 2021) and the Fairwork India "
        "Project (2023), digital labor platforms have expanded exponentially across the Global South, mediating services ranging "
        "from ride-hailing and food delivery to personal beauty and home care. In urban India, where domestic work accounts for "
        "over 10% of total non-agricultural female employment, the intersection of mobile telecommunications and web technology "
        "has initiated a fundamental shift away from localized, kinship-based hiring toward software-mediated algorithmic marketplaces."
    )
    add_p(
        "However, scholarly consensus emphasizes that while platformization possesses the theoretical capacity to formalize unorganized "
        "labor, contemporary commercial implementations frequently exacerbate worker precarity. Platform algorithms often impose opaque "
        "disciplinary regimes, strip workers of labor autonomy, and capture disproportionate economic surplus through aggressive "
        "rent-seeking. This chapter conducts a comprehensive survey of existing industrial and academic paradigms, highlighting the "
        "structural lacunae that KaamConnect resolves."
    )

    # 2.2 Survey of Existing Commercial Solutions
    add_h1("2.2. Survey of Existing Commercial Solutions")
    add_p(
        "A rigorous empirical analysis of existing platforms serving the domestic and home-services market reveals critical architectural "
        "and operational limitations across several market leaders:"
    )
    add_bullet(
        "Urban Company stands as the dominant on-demand home service aggregator in South Asia. While exhibiting exceptional "
        "engineering polish and centralized customer logistics, its business model enforces a high commission structure (20% to 30% per transaction). "
        "Furthermore, workers are subjected to severe automated algorithmic deactivation if customer ratings drop below stringent thresholds, and "
        "the platform predominantly targets episodic technical services (e.g., salon treatments, air conditioning maintenance) rather than "
        "sustaining long-term, daily household domestic support relationships.",
        bold_prefix="1. Urban Company (Formerly UrbanClap):"
    )
    add_bullet(
        "BookMyBai operates as an agency-centric recruitment portal focusing on full-time domestic helpers, nannies, and elderly caretakers. "
        "The system relies on an agency brokerage model, levying steep upfront finder's fees on employers (often equal to one month's helper salary) "
        "while locking workers into contractual arrangements with minimal digital autonomy. The technical architecture is largely static, "
        "lacking real-time state tracking, on-site arrival verification, or direct client-worker in-app chat.",
        bold_prefix="2. BookMyBai:"
    )
    add_bullet(
        "A directory-based model connecting urban households with informal workers in their vicinity. While its low-cost model "
        "facilitates discovery, the platform acts merely as a classified phone directory. Once phone numbers are exchanged, the system maintains zero "
        "engagement: there is no booking lifecycle management, no identity guarantee, no attendance validation, and no digital payment auditing.",
        bold_prefix="3. Helpers Near Me:"
    )
    add_bullet(
        "A prominent Western peer-to-peer gig marketplace for odd jobs and home chores. While pioneering task bidding and "
        "worker self-selection, TaskRabbit charges substantial service and trust fees (up to 30%). It also presumes high digital and written "
        "literacy from both parties, rendering its complex bidding workflow ill-suited for the Indian informal domestic sector.",
        bold_prefix="4. TaskRabbit:"
    )

    # 2.3 Historical Timeline of the Reported Problem
    add_h1("2.3. Historical Timeline of the Reported Problem")
    add_p(
        "Understanding the trajectory of domestic labor mediation contextualizes why existing technical solutions have repeatedly failed "
        "to satisfy either household safety or worker welfare. Figure 2.1 traces the historical evolution of domestic labor sourcing in India "
        "across four distinct epochs:"
    )
    add_bullet(
        "Domestic work was strictly governed by customary, unwritten arrangements rooted in feudal hierarchy. Sourcing was restricted "
        "exclusively to rural kinship ties and inter-generational domestic servitude. Workers had zero legal protections, no wage standards, and "
        "endured severe social stigmatization.",
        bold_prefix="Epoch I — Pre-1990s: Feudal and Kinship-Mediated Domestic Labor:"
    )
    add_bullet(
        "Massive economic liberalization sparked rapid urbanization, leading to the emergence of nuclear households in high-rise complexes. "
        "Unregulated local brokers, security guards, and neighborhood placement agencies emerged as middlemen. These entities charged predatory commissions "
        "and often vanished when criminal incidents or worker mistreatment occurred.",
        bold_prefix="Epoch II — 1991 to 2010: Post-Liberalization Brokerage Syndicates:"
    )
    add_bullet(
        "The advent of the commercial internet birthed web-based classified portals (such as JustDial, Sulekha, and Quikr). "
        "While digitizing phone numbers, these directories lacked identity screening, service verification, and cryptographic trust, leading to widespread "
        "fraud and spam.",
        bold_prefix="Epoch III — 2011 to 2019: Early Web Directories and Unregulated Aggregators:"
    )
    add_bullet(
        "Corporate gig platforms introduced algorithmic dispatch and centralized booking apps. However, aggressive venture-capital "
        "monetization resulted in exorbitant commission takes, worker strikes, algorithmic rating bias, and the total commodification of domestic help. "
        "This crisis created an urgent demand for a dignified, open, zero-commission, cryptographic solution.",
        bold_prefix="Epoch IV — 2020 to Present: Corporate Aggregator Crisis and Worker Strikes:"
    )

    # 2.4 Bibliometric Synthesis of Contemporary Research
    add_h1("2.4. Bibliometric Synthesis of Contemporary Research")
    add_p(
        "Academic literature spanning human-computer interaction (HCI), computer-supported cooperative work (CSCW), and software systems "
        "provides pivotal foundational insights directly informing KaamConnect's engineering design:"
    )
    add_bullet(
        "The annual Fairwork India Project evaluations (Fairwork, 2022, 2023) assess leading digital platforms across five core "
        "principles: Fair Pay, Fair Conditions, Fair Contracts, Fair Management, and Fair Representation. Their empirical findings consistently "
        "reveal that conventional gig aggregators score abysmally in Fair Pay and Fair Management due to excessive platform commissions, non-negotiable "
        "tariffs, and arbitrary worker account terminations. This literature strongly advocates for decentralized or zero-commission peer-to-peer "
        "architectures where workers retain full control over pricing.",
        bold_prefix="1. Algorithmic Precarity and Commission Exploitation:"
    )
    add_bullet(
        "Research by Kumar et al. (ACM CSCW, 2021) and Sambasivan et al. (IEEE Annals, 2020) examining digital interfaces for semi-literate "
        "populations in South Asia highlights that complex multi-level menus and purely text-heavy interfaces induce cognitive friction and system "
        "abandonment. They recommend voice/audio cues, simplified visual iconography, and conversational natural language interfaces that allow "
        "users to communicate in everyday vernacular.",
        bold_prefix="2. Usability and Cognitive Accessibility for Informal Workers:"
    )
    add_bullet(
        "Studies in distributed systems and applied cryptography (Resnick et al., CACM; Dellarocas, Management Science) explore "
        "bilateral trust generation in anonymous peer-to-peer networks. Standard five-star rating systems are chronically vulnerable to inflation, "
        "reprisal fear, and fake reviews. Crucially, literature emphasizes the necessity of cryptographic physical handshakes (such as time-bound One-Time "
        "Passwords) to bind digital state transitions strictly to verified physical co-presence, permanently eliminating attendance disputes.",
        bold_prefix="3. Cryptographic Verification and Physical Co-Presence Handshakes:"
    )

    # 2.5 Comparative Study Matrix
    add_h1("2.5. Comparative Study Matrix")
    add_p(
        "To quantitatively contrast KaamConnect against existing commercial and academic solutions, a comprehensive comparative evaluation "
        "was executed across six fundamental architectural and socio-economic dimensions. Table 2.1 presents this comparative matrix."
    )

    # TABLE 2.1
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(8)
    p_cap.paragraph_format.space_after = Pt(4)
    r_cap = p_cap.add_run("Table 2.1: Comparative Analysis of Domestic Work Platforms vs. KaamConnect")
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(10)
    r_cap.font.bold = True

    comp_headers = [
        "Feature / Evaluation Metric",
        "Urban Company",
        "BookMyBai",
        "Helpers Near Me",
        "TaskRabbit",
        "KaamConnect"
    ]

    comp_rows = [
        ("Platform Commission", "20% - 30% per gig", "Flat Agency Fee (~1 mo. pay)", "Listing Fee to Worker", "15% - 30% Service Fee", "0% (Full Wage Retained)"),
        ("Worker Identity & KYC", "Proprietary Training", "Paper Identity Copies", "Basic Phone Check", "Third-Party Background", "Aadhaar & Admin Portal KYC"),
        ("Physical Arrival Validation", "GPS Geofence Only", "None (Manual Agency)", "None (Offline Call)", "Manual App Check-in", "Dual-OTP Cryptographic Handshake"),
        ("Natural Language Search", "Fixed Nested Menus", "Static Filter Form", "Category Dropdown", "Keyword Search", "Gemini 1.5 Flash Semantic AI"),
        ("Real-Time In-App Messaging", "In-App Chat (Restricted)", "None (Phone / SMS)", "None (Direct Call)", "In-App Chat", "Socket.IO WSS Real-Time Gateway"),
        ("Worker Rate Autonomy", "Platform Imposed Rates", "Fixed Monthly Agency Rate", "Worker Negotiates Off-app", "Worker Hourly Bidding", "Autonomous Worker Hourly Tariff"),
        ("Open Decoupled Tech Stack", "Proprietary Closed Monolith", "Legacy PHP / MySQL", "Basic Web CMS", "Proprietary Rails / React", "Full-Stack MERN (SPA + REST)")
    ]

    table_comp = doc.add_table(rows=len(comp_rows)+1, cols=6)
    table_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w = [Inches(1.8), Inches(1.1), Inches(1.1), Inches(1.1), Inches(1.1), Inches(1.2)]

    for j, h_text in enumerate(comp_headers):
        cell = table_comp.rows[0].cells[j]
        cell.width = col_w[j]
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(h_text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9.5)
        r.font.bold = True
        set_cell_background(cell, "E2E8F0")
        set_cell_border(cell)

    for i, row in enumerate(comp_rows):
        for j, val in enumerate(row):
            cell = table_comp.rows[i+1].cells[j]
            cell.width = col_w[j]
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if j == 0 else WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.15
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9)
            if j == 5:
                r.font.bold = True
            set_cell_border(cell)

    # 2.6 Synthesis Linking Literature Review with KaamConnect
    add_h1("2.6. Synthesis Linking Literature Review with KaamConnect")
    add_p(
        "The synthesis of existing literature and industrial case studies directly validates the engineering hypothesis of KaamConnect. "
        "The failure of current domestic platforms stems not from a lack of market demand, but from fundamentally flawed structural incentives: "
        "they prioritize platform capital extraction over worker welfare and deploy rigid, bureaucratic user interfaces that alienate non-technical "
        "users. KaamConnect bridges these identified gaps by synthesizing three core engineering innovations:"
    )
    add_bullet(
        "By enforcing zero commission and allowing workers to set their own transparent hourly rates, KaamConnect restores agency "
        "and dignity to domestic laborers while eliminating hidden surcharges for households.",
        bold_prefix="Economic Alignment via Zero-Commission Architecture:"
    )
    add_bullet(
        "By binding service transitions to physical co-presence via customer-generated One-Time Passwords, KaamConnect provides "
        "an incontrovertible audit log that protects workers from false non-attendance claims and shields households from phantom billing.",
        bold_prefix="Cryptographic Verification Over Subjective Trust:"
    )
    add_bullet(
        "By deploying Google Gemini 1.5 Flash to convert colloquial language into structured MongoDB aggregation queries, "
        "KaamConnect makes advanced faceted discovery effortless for non-technical users.",
        bold_prefix="Cognitive Accessibility via Generative AI:"
    )

    # 2.7 Problem Definition
    add_h1("2.7. Problem Definition")
    add_p(
        "Formally defined from a software engineering perspective, the core research and development problem addressed by this project is:\n\n"
        "\"To architect, engineer, and deploy an open, highly responsive, full-stack web platform (KaamConnect) that eliminates predatory "
        "intermediary commissions in the urban domestic service sector; implements multi-tier cryptographic and institutional identity verification; "
        "enforces physical service presence validation through a dual-party One-Time Password handshake protocol; enables natural-language "
        "service requirement parsing via generative artificial intelligence; and maintains secure, low-latency, real-time communication across "
        "decoupled cloud infrastructure.\""
    )

    # 2.8 Project Goals and Technical Objectives
    add_h1("2.8. Project Goals and Technical Objectives")
    add_p(
        "To systematically resolve the problem defined above, the project formulated the following six measurable engineering objectives:"
    )
    add_bullet(
        "Develop an open peer-to-peer MERN stack marketplace connecting households directly with domestic workers, guaranteeing 100% wage retention.",
        bold_prefix="Objective 1 (Zero-Commission Direct Sourcing):"
    )
    add_bullet(
        "Implement a rigorous verification pipeline supporting Aadhaar submission, address validation, and administrative KYC clearance workflows.",
        bold_prefix="Objective 2 (Multi-Tier Identity & Security):"
    )
    add_bullet(
        "Engineer a fail-safe booking state machine requiring a 4-digit startOtp on arrival and a completion confirmation handshake to prevent phantom attendance.",
        bold_prefix="Objective 3 (Cryptographic Dual-OTP Service Verification):"
    )
    add_bullet(
        "Integrate the Google Gemini 1.5 Flash API to parse complex, unstructured natural language search prompts into structured query filters.",
        bold_prefix="Objective 4 (AI-Enabled Semantic Discovery):"
    )
    add_bullet(
        "Implement a bi-directional WebSocket gateway using Socket.IO to enable instantaneous, persistent in-app messaging between customers and workers.",
        bold_prefix="Objective 5 (Real-Time Asynchronous Messaging):"
    )
    add_bullet(
        "Deploy the decoupled application across Vercel (frontend), Render (backend), and MongoDB Atlas (database), achieving sub-150ms API latencies, zero server crashes, and 100% test pass rate.",
        bold_prefix="Objective 6 (Production Cloud Reliability & Performance):"
    )

    doc.add_page_break()
    print("Chapter 2 written successfully.")

