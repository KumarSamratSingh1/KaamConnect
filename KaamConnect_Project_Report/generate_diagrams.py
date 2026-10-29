import os
from PIL import Image, ImageDraw, ImageFont

out_dir = os.path.abspath(r'KaamConnect_Project_Report\screenshots')
os.makedirs(out_dir, exist_ok=True)

def get_font(size, bold=False):
    # Try Windows fonts
    font_paths = [
        r'C:\Windows\Fonts\arialbd.ttf' if bold else r'C:\Windows\Fonts\arial.ttf',
        r'C:\Windows\Fonts\segoeuib.ttf' if bold else r'C:\Windows\Fonts\segoeui.ttf',
        r'C:\Windows\Fonts\timesbd.ttf' if bold else r'C:\Windows\Fonts\times.ttf'
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_title = get_font(20, bold=True)
font_heading = get_font(15, bold=True)
font_body = get_font(12, bold=False)
font_small = get_font(10, bold=False)
font_bold_small = get_font(11, bold=True)

# 1. GRAPHICAL ABSTRACT
def draw_graphical_abstract():
    w, h = 1000, 520
    img = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(img)

    # Outer border
    draw.rounded_rectangle([15, 15, w-15, h-15], radius=16, outline='#059669', width=2)
    # Header banner
    draw.rounded_rectangle([25, 25, w-25, 75], radius=10, fill='#ECFDF5', outline='#A7F3D0', width=1)
    draw.text((w//2, 50), "KAAMCONNECT — GRAPHICAL ABSTRACT", fill='#065F46', font=font_title, anchor='mm')

    # Column 1: Actors / Users
    draw.rounded_rectangle([40, 100, 220, 480], radius=12, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.text((130, 125), "PLATFORM ACTORS", fill='#0F172A', font=font_heading, anchor='mm')

    actors = [
        ("Customer", "Browse, search, book helpers,\nshare arrival startOtp, rate"),
        ("Worker Partner", "Create KYC profile, set shifts,\nverify OTP on arrival, earn"),
        ("Administrator", "Verify Aadhaar/police docs,\nmonitor platform disputes")
    ]
    y_act = 160
    for name, desc in actors:
        draw.rounded_rectangle([55, y_act, 205, y_act+80], radius=8, fill='#FFFFFF', outline='#059669', width=1)
        draw.text((130, y_act+20), name, fill='#047857', font=font_bold_small, anchor='mm')
        draw.text((130, y_act+50), desc, fill='#475569', font=font_small, anchor='mm')
        y_act += 105

    # Arrow from Actors to Client Layer
    draw.line([(220, 290), (260, 290)], fill='#059669', width=3)
    draw.polygon([(265, 290), (255, 285), (255, 295)], fill='#059669')

    # Column 2: Presentation Layer (React SPA)
    draw.rounded_rectangle([270, 100, 470, 480], radius=12, fill='#F0FDF4', outline='#86EFAC', width=1)
    draw.text((370, 125), "PRESENTATION LAYER", fill='#166534', font=font_heading, anchor='mm')
    draw.text((370, 145), "React 18 SPA (Vercel CDN)", fill='#15803D', font=font_bold_small, anchor='mm')

    ui_boxes = [
        ("Tailwind CSS Design Tokens", "Plus Jakarta Sans, Emerald palette,\nmicro-shadows, responsive grid"),
        ("Redux Toolkit Store", "authSlice, workerSlice, bookingSlice,\nchatSlice, uiSlice (dark/light)"),
        ("Framer Motion & Components", "Smooth page transitions, modals,\nskeleton loaders, ErrorBoundary"),
        ("Axios Interceptors & Socket.IO", "Dynamic Render/Local API fallback,\nJWT refresh & real-time chat client")
    ]
    y_ui = 175
    for title, sub in ui_boxes:
        draw.rounded_rectangle([285, y_ui, 455, y_ui+65], radius=8, fill='#FFFFFF', outline='#BBF7D0', width=1)
        draw.text((370, y_ui+18), title, fill='#047857', font=font_bold_small, anchor='mm')
        draw.text((370, y_ui+44), sub, fill='#475569', font=font_small, anchor='mm')
        y_ui += 75

    # Arrow from Presentation to Backend API
    draw.line([(470, 290), (510, 290)], fill='#059669', width=3)
    draw.polygon([(515, 290), (505, 285), (505, 295)], fill='#059669')

    # Column 3: Backend API & Services Layer
    draw.rounded_rectangle([520, 100, 720, 480], radius=12, fill='#F8FAFC', outline='#94A3B8', width=1)
    draw.text((620, 125), "APPLICATION LAYER", fill='#0F172A', font=font_heading, anchor='mm')
    draw.text((620, 145), "Node.js + Express (Render)", fill='#334155', font=font_bold_small, anchor='mm')

    api_boxes = [
        ("REST API & JWT Auth", "bcryptjs password hashing,\naccess token (7d) & refresh (30d)"),
        ("Booking & Escrow Engine", "Dual OTP generation, status\nprogression, mock escrow release"),
        ("Gemini AI Semantic Parser", "Natural language requirement\nanalysis to JSON search filters"),
        ("Socket.IO Realtime Engine", "Bi-directional WebSocket messaging,\nroom-based private chat dispatch")
    ]
    y_api = 175
    for title, sub in api_boxes:
        draw.rounded_rectangle([535, y_api, 705, y_api+65], radius=8, fill='#FFFFFF', outline='#CBD5E1', width=1)
        draw.text((620, y_api+18), title, fill='#0F172A', font=font_bold_small, anchor='mm')
        draw.text((620, y_api+44), sub, fill='#475569', font=font_small, anchor='mm')
        y_api += 75

    # Arrow from Backend to Cloud & DB Layer
    draw.line([(720, 290), (760, 290)], fill='#059669', width=3)
    draw.polygon([(765, 290), (755, 285), (755, 295)], fill='#059669')

    # Column 4: Cloud Data & Assets Layer
    draw.rounded_rectangle([770, 100, 960, 480], radius=12, fill='#FEFCE8', outline='#FDE047', width=1)
    draw.text((865, 125), "PERSISTENCE & CLOUD", fill='#854D0E', font=font_heading, anchor='mm')
    draw.text((865, 145), "MongoDB Atlas & Media CDN", fill='#A16207', font=font_bold_small, anchor='mm')

    db_boxes = [
        ("MongoDB Atlas", "6 Schemas (Users, Profiles,\nBookings, Reviews, Chat)"),
        ("Geospatial & Search", "GeoJSON 2dsphere indexes,\nsalary range, ratings, skills"),
        ("Cloudinary CDN", "KYC documents, ID verification,\nprofile image storage"),
        ("Google Gemini API", "Gemini 1.5 Flash natural\nlanguage requirement endpoint")
    ]
    y_db = 175
    for title, sub in db_boxes:
        draw.rounded_rectangle([785, y_db, 945, y_db+65], radius=8, fill='#FFFFFF', outline='#FEF08A', width=1)
        draw.text((865, y_db+18), title, fill='#854D0E', font=font_bold_small, anchor='mm')
        draw.text((865, y_db+44), sub, fill='#475569', font=font_small, anchor='mm')
        y_db += 75

    img.save(os.path.join(out_dir, 'fig_graphical_abstract.png'))
    print('Generated fig_graphical_abstract.png')

# 2. SYSTEM ARCHITECTURE
def draw_system_architecture():
    w, h = 900, 560
    img = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([15, 15, w-15, h-15], radius=14, outline='#047857', width=2)
    draw.text((w//2, 45), "KAAMCONNECT 3-TIER SYSTEM ARCHITECTURE", fill='#064E3B', font=font_title, anchor='mm')

    # Tier 1: Client Tier
    draw.rounded_rectangle([40, 80, w-40, 190], radius=10, fill='#F0FDF4', outline='#86EFAC', width=2)
    draw.text((80, 105), "TIER 1: PRESENTATION LAYER (CLIENT DEVICES & BROWSER)", fill='#166534', font=font_heading, anchor='lm')
    draw.text((80, 125), "Single Page Application (SPA) deployed on Vercel Global Edge Network", fill='#15803D', font=font_small, anchor='lm')

    draw.rounded_rectangle([60, 140, 240, 180], radius=6, fill='#FFFFFF', outline='#4ADE80', width=1)
    draw.text((150, 160), "Desktop Web Client", fill='#047857', font=font_bold_small, anchor='mm')

    draw.rounded_rectangle([260, 140, 460, 180], radius=6, fill='#FFFFFF', outline='#4ADE80', width=1)
    draw.text((360, 160), "Mobile Responsive Browser", fill='#047857', font=font_bold_small, anchor='mm')

    draw.rounded_rectangle([480, 140, 680, 180], radius=6, fill='#FFFFFF', outline='#4ADE80', width=1)
    draw.text((580, 160), "Redux State & React Router", fill='#047857', font=font_bold_small, anchor='mm')

    draw.rounded_rectangle([700, 140, 860, 180], radius=6, fill='#FFFFFF', outline='#4ADE80', width=1)
    draw.text((780, 160), "Socket.IO Client", fill='#047857', font=font_bold_small, anchor='mm')

    # Arrow Down
    draw.line([(w//2, 190), (w//2, 230)], fill='#059669', width=3)
    draw.polygon([(w//2, 235), (w//2-6, 225), (w//2+6, 225)], fill='#059669')
    draw.text((w//2+15, 210), "HTTPS / REST & WSS (Socket.IO)", fill='#047857', font=font_small, anchor='lm')

    # Tier 2: Application / Server Tier
    draw.rounded_rectangle([40, 240, w-40, 390], radius=10, fill='#F8FAFC', outline='#94A3B8', width=2)
    draw.text((80, 265), "TIER 2: APPLICATION LOGIC & MICRO-SERVICES LAYER", fill='#0F172A', font=font_heading, anchor='lm')
    draw.text((80, 285), "Node.js v23 / Express.js REST Framework deployed on Render Cloud", fill='#475569', font=font_small, anchor='lm')

    draw.rounded_rectangle([60, 305, 240, 375], radius=6, fill='#FFFFFF', outline='#CBD5E1', width=1)
    draw.text((150, 325), "Authentication & JWT", fill='#0F172A', font=font_bold_small, anchor='mm')
    draw.text((150, 350), "Role-based guards (Auth, Admin)", fill='#475569', font=font_small, anchor='mm')

    draw.rounded_rectangle([260, 305, 460, 375], radius=6, fill='#FFFFFF', outline='#CBD5E1', width=1)
    draw.text((360, 325), "Booking & Dual OTP Service", fill='#0F172A', font=font_bold_small, anchor='mm')
    draw.text((360, 350), "Status transitions & verification", fill='#475569', font=font_small, anchor='mm')

    draw.rounded_rectangle([480, 305, 660, 375], radius=6, fill='#FFFFFF', outline='#CBD5E1', width=1)
    draw.text((570, 325), "Gemini AI Semantic Parser", fill='#0F172A', font=font_bold_small, anchor='mm')
    draw.text((570, 350), "NLP requirement classification", fill='#475569', font=font_small, anchor='mm')

    draw.rounded_rectangle([680, 305, 860, 375], radius=6, fill='#FFFFFF', outline='#CBD5E1', width=1)
    draw.text((770, 325), "Socket.IO Chat Gateway", fill='#0F172A', font=font_bold_small, anchor='mm')
    draw.text((770, 350), "Real-time message routing", fill='#475569', font=font_small, anchor='mm')

    # Arrow Down
    draw.line([(w//2, 390), (w//2, 430)], fill='#059669', width=3)
    draw.polygon([(w//2, 435), (w//2-6, 425), (w//2+6, 425)], fill='#059669')
    draw.text((w//2+15, 410), "Mongoose ODM Protocol & REST APIs", fill='#047857', font=font_small, anchor='lm')

    # Tier 3: Data Tier
    draw.rounded_rectangle([40, 440, w-40, 530], radius=10, fill='#FEFCE8', outline='#FDE047', width=2)
    draw.text((80, 460), "TIER 3: DATA PERSISTENCE & EXTERNAL SERVICES", fill='#854D0E', font=font_heading, anchor='lm')

    draw.rounded_rectangle([60, 475, 300, 515], radius=6, fill='#FFFFFF', outline='#FACC15', width=1)
    draw.text((180, 495), "MongoDB Atlas Managed Database", fill='#713F12', font=font_bold_small, anchor='mm')

    draw.rounded_rectangle([320, 475, 580, 515], radius=6, fill='#FFFFFF', outline='#FACC15', width=1)
    draw.text((450, 495), "Cloudinary Asset Storage CDN", fill='#713F12', font=font_bold_small, anchor='mm')

    draw.rounded_rectangle([600, 475, 860, 515], radius=6, fill='#FFFFFF', outline='#FACC15', width=1)
    draw.text((730, 495), "Google Gemini 1.5 Flash Endpoint", fill='#713F12', font=font_bold_small, anchor='mm')

    img.save(os.path.join(out_dir, 'fig_system_architecture.png'))
    print('Generated fig_system_architecture.png')

# 3. USE CASE DIAGRAM
def draw_use_case():
    w, h = 900, 540
    img = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([15, 15, w-15, h-15], radius=12, outline='#0F172A', width=2)
    draw.text((w//2, 40), "KAAMCONNECT USE CASE MODEL", fill='#0F172A', font=font_title, anchor='mm')

    # System boundary
    draw.rounded_rectangle([220, 70, 680, 510], radius=10, fill='#F8FAFC', outline='#334155', width=2)
    draw.text((w//2, 90), "KaamConnect Core Platform Boundary", fill='#475569', font=font_bold_small, anchor='mm')

    # Left Actor: Customer
    draw.ellipse([70, 160, 120, 210], outline='#047857', fill='#ECFDF5', width=2)
    draw.text((95, 230), "CUSTOMER", fill='#047857', font=font_heading, anchor='mm')

    # Left Actor: Worker
    draw.ellipse([70, 340, 120, 390], outline='#0284C7', fill='#F0F9FF', width=2)
    draw.text((95, 410), "WORKER PARTNER", fill='#0369A1', font=font_heading, anchor='mm')

    # Right Actor: Admin
    draw.ellipse([770, 250, 820, 300], outline='#B91C1C', fill='#FEF2F2', width=2)
    draw.text((795, 320), "ADMINISTRATOR", fill='#B91C1C', font=font_heading, anchor='mm')

    use_cases = [
        ("Register & Authenticate (JWT)", 125),
        ("Natural Language AI Search", 175),
        ("Browse & Filter Verified Helpers", 225),
        ("Direct Booking & Location Setup", 275),
        ("Verify Dual Start-OTP on Arrival", 325),
        ("Real-time Direct Chat (Socket.IO)", 375),
        ("Worker KYC Onboarding & Shifts", 425),
        ("Platform Moderation & Verification", 475)
    ]

    for title, y_uc in use_cases:
        draw.ellipse([300, y_uc-18, 600, y_uc+18], fill='#FFFFFF', outline='#059669', width=2)
        draw.text((450, y_uc), title, fill='#0F172A', font=font_bold_small, anchor='mm')

    # Lines Customer to Use Cases
    for y_target in [125, 175, 225, 275, 325, 375]:
        draw.line([(120, 185), (300, y_target)], fill='#047857', width=1)

    # Lines Worker to Use Cases
    for y_target in [125, 325, 375, 425]:
        draw.line([(120, 365), (300, y_target)], fill='#0369A1', width=1)

    # Lines Admin to Use Cases
    for y_target in [125, 475]:
        draw.line([(770, 275), (600, y_target)], fill='#B91C1C', width=1)

    img.save(os.path.join(out_dir, 'fig_use_case_diagram.png'))
    print('Generated fig_use_case_diagram.png')

# 4. DATA FLOW DIAGRAM LEVEL 1
def draw_dfd():
    w, h = 900, 520
    img = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([15, 15, w-15, h-15], radius=12, outline='#0F172A', width=2)
    draw.text((w//2, 40), "KAAMCONNECT LEVEL-1 DATA FLOW DIAGRAM (DFD)", fill='#0F172A', font=font_title, anchor='mm')

    # Entities
    draw.rectangle([40, 120, 160, 180], fill='#F1F5F9', outline='#334155', width=2)
    draw.text((100, 150), "Customer", fill='#0F172A', font=font_heading, anchor='mm')

    draw.rectangle([40, 320, 160, 380], fill='#F1F5F9', outline='#334155', width=2)
    draw.text((100, 350), "Worker Partner", fill='#0F172A', font=font_heading, anchor='mm')

    draw.rectangle([740, 220, 860, 280], fill='#F1F5F9', outline='#334155', width=2)
    draw.text((800, 250), "Administrator", fill='#0F172A', font=font_heading, anchor='mm')

    # Processes
    procs = [
        ("1.0\nAuth & KYC\nManagement", 280, 120),
        ("2.0\nAI Semantic Match\n& Search Engine", 500, 120),
        ("3.0\nBooking, OTP &\nEscrow Lifecycle", 280, 320),
        ("4.0\nRealtime Chat &\nNotifications", 500, 320)
    ]
    for label, px, py in procs:
        draw.rounded_rectangle([px-65, py-35, px+65, py+35], radius=12, fill='#ECFDF5', outline='#059669', width=2)
        draw.text((px, py), label, fill='#065F46', font=font_bold_small, anchor='mm')

    # Data Stores
    stores = [
        ("D1: Users Collection", 390, 220),
        ("D2: Bookings & OTP Store", 390, 440),
        ("D3: Conversations & Messages", 650, 440)
    ]
    for label, sx, sy in stores:
        draw.line([(sx-80, sy-15), (sx+80, sy-15)], fill='#0F172A', width=2)
        draw.line([(sx-80, sy+15), (sx+80, sy+15)], fill='#0F172A', width=2)
        draw.text((sx, sy), label, fill='#0F172A', font=font_bold_small, anchor='mm')

    # Flows
    draw.line([(160, 140), (215, 140)], fill='#059669', width=2)
    draw.text((185, 130), "Credentials", fill='#475569', font=font_small, anchor='mm')

    draw.line([(345, 140), (435, 140)], fill='#059669', width=2)
    draw.text((390, 130), "Search query", fill='#475569', font=font_small, anchor='mm')

    draw.line([(160, 340), (215, 340)], fill='#059669', width=2)
    draw.text((185, 330), "Verify startOtp", fill='#475569', font=font_small, anchor='mm')

    draw.line([(280, 155), (280, 285)], fill='#059669', width=2)
    draw.text((250, 220), "User Context", fill='#475569', font=font_small, anchor='mm')

    draw.line([(500, 155), (500, 285)], fill='#059669', width=2)
    draw.text((540, 220), "Worker Match", fill='#475569', font=font_small, anchor='mm')

    img.save(os.path.join(out_dir, 'fig_dfd_level1.png'))
    print('Generated fig_dfd_level1.png')

# 5. ER DIAGRAM
def draw_er_diagram():
    w, h = 960, 560
    img = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([15, 15, w-15, h-15], radius=12, outline='#047857', width=2)
    draw.text((w//2, 40), "KAAMCONNECT MONGODB ENTITY-RELATIONSHIP SCHEMA", fill='#064E3B', font=font_title, anchor='mm')

    tables = [
        ("USER", 50, 80, [
            "_id: ObjectId (PK)", "name: String", "email: String (Unique)",
            "password: String (Hash)", "role: Enum (cust/work/admin)",
            "phone: String", "location: {city, address}", "isBlocked: Boolean"
        ]),
        ("WORKER_PROFILE", 360, 80, [
            "_id: ObjectId (PK)", "user: ObjectId (FK -> User)",
            "skills: [String]", "experience: Number",
            "expectedSalary: {min, max, per}", "availabilityStatus: Enum",
            "verificationStatus: Enum", "rating: {avg, count}"
        ]),
        ("BOOKING", 670, 80, [
            "_id: ObjectId (PK)", "customer: ObjectId (FK -> User)",
            "worker: ObjectId (FK -> User)", "primaryService: String",
            "scheduledDate: Date", "startOtp: String (4-digit)",
            "endOtp: String", "status: Enum", "pricing: {totalAmount}"
        ]),
        ("REVIEW", 50, 340, [
            "_id: ObjectId (PK)", "booking: ObjectId (FK)",
            "worker: ObjectId (FK -> User)", "reviewer: ObjectId (FK)",
            "rating: Number (1-5)", "comment: String", "createdAt: Date"
        ]),
        ("CONVERSATION", 360, 340, [
            "_id: ObjectId (PK)", "participants: [ObjectId (FK)]",
            "booking: ObjectId (FK)", "lastMessage: ObjectId (FK)",
            "updatedAt: Date"
        ]),
        ("MESSAGE", 670, 340, [
            "_id: ObjectId (PK)", "conversationId: ObjectId (FK)",
            "sender: ObjectId (FK -> User)", "content: String",
            "read: Boolean", "createdAt: Date"
        ])
    ]

    for title, tx, ty, fields in tables:
        draw.rounded_rectangle([tx, ty, tx+240, ty+210], radius=8, fill='#F8FAFC', outline='#059669', width=2)
        # Header bar
        draw.rounded_rectangle([tx, ty, tx+240, ty+35], radius=6, fill='#ECFDF5', outline='#059669', width=1)
        draw.text((tx+120, ty+18), title, fill='#065F46', font=font_heading, anchor='mm')

        y_f = ty + 48
        for f in fields:
            draw.text((tx+12, y_f), f, fill='#334155', font=font_small)
            y_f += 19

    # Relationship connectors
    # User to WorkerProfile (1 to 1)
    draw.line([(290, 180), (360, 180)], fill='#047857', width=2)
    draw.text((325, 170), "1 : 1", fill='#047857', font=font_bold_small, anchor='mm')

    # WorkerProfile to Booking (1 to N)
    draw.line([(600, 180), (670, 180)], fill='#047857', width=2)
    draw.text((635, 170), "1 : N", fill='#047857', font=font_bold_small, anchor='mm')

    # Booking to Review (1 to 1)
    draw.line([(790, 290), (790, 315), (170, 315), (170, 340)], fill='#047857', width=2)
    draw.text((450, 305), "Booking to Review (1 : 1)", fill='#047857', font=font_small, anchor='mm')

    # Conversation to Message (1 to N)
    draw.line([(600, 440), (670, 440)], fill='#047857', width=2)
    draw.text((635, 430), "1 : N", fill='#047857', font=font_bold_small, anchor='mm')

    img.save(os.path.join(out_dir, 'fig_er_diagram.png'))
    print('Generated fig_er_diagram.png')

# 6. SEQUENCE DIAGRAM
def draw_sequence_diagram():
    w, h = 920, 560
    img = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([15, 15, w-15, h-15], radius=12, outline='#047857', width=2)
    draw.text((w//2, 40), "KAAMCONNECT BOOKING & DUAL OTP SEQUENCE", fill='#064E3B', font=font_title, anchor='mm')

    columns = [
        ("Customer", 100),
        ("React UI", 280),
        ("Express API", 470),
        ("MongoDB Atlas", 660),
        ("Worker", 830)
    ]

    for label, cx in columns:
        draw.rounded_rectangle([cx-60, 70, cx+60, 105], radius=6, fill='#F0FDF4', outline='#059669', width=2)
        draw.text((cx, 88), label, fill='#047857', font=font_bold_small, anchor='mm')
        draw.line([(cx, 105), (cx, 510)], fill='#94A3B8', width=1)

    steps = [
        (100, 280, 130, "1. Select helper & click Book", '#0F172A'),
        (280, 470, 165, "2. POST /api/bookings (payload)", '#0F172A'),
        (470, 660, 200, "3. Insert Booking (status: pending, gen OTP)", '#0F172A'),
        (470, 830, 235, "4. Socket alert: New Assignment", '#047857'),
        (830, 470, 270, "5. PATCH /api/bookings/:id/respond (accept)", '#047857'),
        (470, 660, 305, "6. Update status -> 'accepted'", '#0F172A'),
        (470, 280, 340, "7. Push notification & display startOtp", '#0F172A'),
        (100, 830, 380, "8. Physical arrival on-site: customer shares startOtp", '#B45309'),
        (830, 470, 420, "9. PATCH /api/bookings/:id/start (send OTP)", '#047857'),
        (470, 660, 455, "10. Verify OTP matches -> status: 'in_progress'", '#0F172A'),
        (470, 280, 490, "11. Real-time status update to Customer UI", '#047857')
    ]

    for x1, x2, y, txt, col in steps:
        draw.line([(x1, y), (x2, y)], fill=col, width=2)
        if x2 > x1:
            draw.polygon([(x2, y), (x2-8, y-4), (x2-8, y+4)], fill=col)
        else:
            draw.polygon([(x2, y), (x2+8, y-4), (x2+8, y+4)], fill=col)
        draw.text(((x1+x2)//2, y-10), txt, fill=col, font=font_small, anchor='mm')

    img.save(os.path.join(out_dir, 'fig_sequence_diagram.png'))
    print('Generated fig_sequence_diagram.png')

if __name__ == '__main__':
    draw_graphical_abstract()
    draw_system_architecture()
    draw_use_case()
    draw_dfd()
    draw_er_diagram()
    draw_sequence_diagram()
    print('All diagrams generated successfully!')

