# 🏠 KaamConnect — Domestic Services & Home Care Marketplace

> **Tagline:** *Your Home. Your Help. One Connection.*  
> A production-grade full-stack MERN marketplace connecting households with verified domestic service professionals (cooks, housekeepers, babysitters, eldercare nurses, and home assistants). Designed for reliability, safety, and instant discovery across urban India.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-10B981?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Project Report](https://img.shields.io/badge/Academic%20Report-PDF%20%26%20DOCX-blueviolet?style=for-the-badge)](KaamConnect_Project_Report/KaamConnect_Project_Report.pdf)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

### 📄 Academic Project Report & Documentation
The complete, university-formatted project report strictly following official B.E. CSE formatting guidelines is available in the repository:
- 📕 **Official Report PDF:** [`KaamConnect_Project_Report.pdf`](KaamConnect_Project_Report/KaamConnect_Project_Report.pdf)
- 📝 **Editable Word Document:** [`KaamConnect_Project_Report.docx`](KaamConnect_Project_Report/KaamConnect_Project_Report.docx)
- 📑 **Complete Markdown Source:** [`KaamConnect_Project_Report_Source.md`](KaamConnect_Project_Report/KaamConnect_Project_Report_Source.md)
- 📊 **Architecture Diagrams & Production Screenshots:** [`KaamConnect_Project_Report/screenshots/`](KaamConnect_Project_Report/screenshots/)

**Project Team (Chandigarh University — B.E. Computer Science & Engineering):**
- **Kumar Samrat Singh** (UID: 24BCS10320)
- **Sahil Kumar** (UID: 24BCS11637)
- **Krish Sonu Kumar** (UID: 24BCS11661)  
*Supervised by:* **Er. Venkatesh K** | *Head of Department:* **Dr. Sandeep Singh Kang**

---

## 1. Project Introduction

**KaamConnect** is a full-featured domestic help and home service platform developed for the **Full Stack Development (FSD II)** semester project. It modernizes the informal household domestic worker sector in India by combining:
- **Instant Discovery:** Geolocation-indexed search for trusted local help.
- **AI-Powered Matching:** Plain-language requirement understanding powered by Google Gemini.
- **Safety & Verification:** Multitiered KYC verification (Aadhaar & Police Clearance badges).
- **Secure Lifecycle:** Real-time job acceptance, start/complete OTP verification, and escrow payment protection.

---

## 2. Problem Statement

India's domestic services sector employs over 50 million informal workers, yet remains plagued by significant structural challenges:
1. **Unreliable Discovery:** Households rely predominantly on word-of-mouth or unverified localized agents.
2. **Safety & Trust Deficit:** Lack of standardized background checks or centralized identity verification.
3. **Disorganized Job Terms:** Unpredictable wage agreements, absence of transparent scheduling, and lack of accountability.
4. **Communication Friction:** Absence of real-time messaging, status visibility, or digital records for services rendered.

---

## 3. Project Objectives

- **Democratize Access:** Provide a mobile-responsive web portal where customers can effortlessly locate verified service providers within a customizable geographic radius.
- **Empower Workers:** Offer domestic helpers a digital resume, verified reputation metrics, schedule controls, and predictable earnings.
- **Real-Time Responsiveness:** Deliver immediate status updates via WebSockets (Socket.IO) for booking requests, messaging, and service tracking.
- **Intelligent Assistance:** Integrate Google Gemini AI to translate unstructured customer queries (*"Need an urgent cook who knows South Indian food for mornings"*) into structured database query filters.

---

## 4. Key Features

### 👤 Customer Experience
* **AI Natural Language Search:** Describe household needs in plain English or Hindi; Gemini AI parses skills, shift timings, budget, and urgency automatically.
* **Granular Filters:** Filter by 8+ core domestic skills, customer ratings, hourly/monthly salary brackets, and city.
* **Worker Profile Showcase:** Review verified credentials, years of experience, language proficiencies, badges, and verified customer reviews.
* **4-Step Booking Wizard:** Intuitive step-by-step booking flow (Service Selection &rarr; Timing & Schedule &rarr; Service Address &rarr; Review & Escrow Payment).
* **Job Tracking with OTP:** Track real-time progress with secret 4-digit start and end verification OTPs.
* **Integrated Escrow Checkout:** Razorpay-ready payment pipeline holding funds until satisfactory task completion.

### 🧹 Domestic Helper / Worker Partner Portal
* **Digital Profile & Onboarding:** 4-step wizard for personal bio, work categories, daily availability schedules, and salary expectations.
* **KYC Document Uploads:** Cloudinary-backed secure Aadhaar and document verification upload pipeline.
* **Real-Time Job Notifications:** Instant Socket.IO desktop/mobile audio-visual booking alert toasts with Accept / Decline controls.
* **Live Availability Toggle:** Instant toggle between `Available` and `Busy` states with live platform-wide broadcast.
* **Job Execution Controls:** Start and complete tasks using customer-provided OTPs for transparent accountability.

### 🛡️ Administrative Control Center
* **Executive Metrics Dashboard:** Visualized revenue, booking trends, and user growth charts built with Recharts.
* **User Management:** Full customer and worker directory with one-click account suspension/reactivation.
* **Verification Queue:** Review uploaded KYC identity cards and grant official platform verification badges.
* **Master Booking Monitor:** Complete audit trail of active, completed, and disputed platform bookings.

### 💬 Real-Time Communication & Notifications
* **In-App Messaging:** Direct customer-worker chat rooms with typing indicators, delivery timestamps, and unread badges.
* **Push-Style Notifications:** Personal notification feeds for booking status changes, reminders, and payment receipts.

---

## 5. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, React Router v6, Redux Toolkit (State Management) |
| **Styling & Design System** | Tailwind CSS v3, Plus Jakarta Sans Typography, Custom CSS Design Tokens |
| **Icons & Animations** | Lucide React, Framer Motion |
| **Data Visualization** | Recharts (Revenue, Bookings & Category Distribution) |
| **Backend Runtime** | Node.js (LTS), Express.js |
| **Database & ODM** | MongoDB Atlas, Mongoose (with 2dsphere Geospatial Indexing) |
| **Real-Time Engine** | Socket.IO (v4) with JWT handshake authentication |
| **Artificial Intelligence** | Google Gemini Flash API (`models/gemini-flash-latest`) |
| **Media Cloud Storage** | Cloudinary SDK (Document & Profile Image Processing) |
| **Security & Utilities** | Helmet, Express Rate Limit, Bcrypt.js, JSON Web Tokens (JWT) |

---

## 6. MERN Architecture

```
┌────────────────────────────────────────────────────────┐
│               KaamConnect React 18 Client              │
│      (Redux Toolkit State • Tailwind CSS • Socket.IO)  │
└───────────────────────────▲────────────────────────────┘
                            │ HTTPS / WSS
┌───────────────────────────▼────────────────────────────┐
│               Express.js REST & Socket API             │
│   ┌────────────────────────────────────────────────┐   │
│   │ Middleware: Helmet, CORS, RateLimiter, JWT Auth │   │
│   └───────────────────────┬────────────────────────┘   │
│                           │                            │
│   ┌───────────────┬───────┴───────┬────────────────┐   │
│   │ Auth & Users  │ Bookings/OTP  │ Worker Profiles│   │
│   └───────┬───────┴───────┬───────┴────────┬───────┘   │
└───────────┼───────────────┼────────────────┼───────────┘
            │               │                │
┌───────────▼───────────────▼────────────────▼───────────┐
│                   Data & Cloud Layer                   │
│  MongoDB Atlas   │  Google Gemini AI  │   Cloudinary   │
│ (2dsphere Geos)  │   (NLP Matching)   │ (Media Assets) │
└────────────────────────────────────────────────────────┘
```

---

## 7. Folder Structure

```
KaamConnect/
├── backend/
│   ├── config/             # DB & Cloudinary storage configuration
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/        # Route logic & controllers
│   │   ├── adminController.js
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── workerController.js
│   ├── middleware/         # Security & JWT authorization guards
│   ├── models/             # Mongoose schemas (User, WorkerProfile, Booking, Review, Chat)
│   ├── routes/             # REST endpoints (auth, workers, bookings, admin, ai, chat)
│   ├── socket/             # Socket.IO event handler
│   ├── utils/              # JWT helpers & MongoDB seed scripts
│   ├── .env.example        # Environment variable template
│   └── server.js           # Server bootstrap & middleware
│
├── frontend/
│   ├── public/             # Static HTML template & KaamConnect metadata
│   ├── src/
│   │   ├── components/     # UI components (Navbar, Footer, WorkerCard, Badges)
│   │   ├── pages/
│   │   │   ├── admin/      # Admin dashboard, bookings, users, verifications
│   │   │   ├── auth/       # Login & Register with 1-click demo login
│   │   │   ├── customer/   # Search, Dashboard, Booking Wizard, Payment, Bookings
│   │   │   ├── shared/     # Landing page, Worker Profile, Chat, 404
│   │   │   └── worker/     # Worker Dashboard, Onboarding Wizard, My Jobs
│   │   ├── store/          # Redux Toolkit store & slices
│   │   ├── styles/         # Tailwind CSS & design tokens
│   │   ├── utils/          # Axios interceptors, Socket client helpers
│   │   └── App.js          # Route definitions & protected route guards
│   ├── .env.example        # Frontend environment template
│   └── tailwind.config.js  # Theme configuration (Emerald & Amber tokens)
│
├── DEPLOYMENT_GUIDE.md     # Production deployment instructions
├── README.md               # Project documentation
└── package.json
```

---

## 8. Installation Instructions

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MongoDB**: A free MongoDB Atlas cluster URI (or local MongoDB 6+)
* **Cloudinary Account**: Cloud Name, API Key, and API Secret
* **Google Gemini API Key**: Free API key from Google AI Studio

### Step-by-Step Setup

```bash
# 1. Clone repository
git clone https://github.com/KumarSamratSingh1/KaamConnect.git
cd KaamConnect

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

---

## 9. Environment Variable Setup

### Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory referencing `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kaamconnect?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_32_chars
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI
GEMINI_API_KEY=your_gemini_api_key

# Payment (Mock / Test)
RAZORPAY_KEY_ID=rzp_test_mock_key
RAZORPAY_KEY_SECRET=rzp_test_mock_secret
ADMIN_EMAIL=admin@kaamconnect.com
```

### Frontend Configuration (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 10. API Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System health and version check |
| `POST` | `/api/auth/register` | Public | Register customer or worker |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT tokens |
| `GET` | `/api/workers` | Public | Search workers with skills, rating, city filters |
| `GET` | `/api/workers/:id` | Public | View detailed worker profile & reviews |
| `PATCH` | `/api/workers/availability` | Worker | Toggle worker availability (`available`/`busy`) |
| `POST` | `/api/bookings` | Customer | Create booking reservation |
| `GET` | `/api/bookings/my` | Authenticated | Retrieve customer or worker booking history |
| `PATCH` | `/api/bookings/:id/respond`| Worker | Accept or decline booking request |
| `PATCH` | `/api/bookings/:id/start` | Worker | Start job execution with OTP verification |
| `PATCH` | `/api/bookings/:id/complete`| Worker | Complete task execution |
| `POST` | `/api/payments/create-order`| Customer | Generate Razorpay escrow order |
| `POST` | `/api/ai/parse-requirement` | Public | Gemini NLP requirement parser |
| `GET` | `/api/admin/stats` | Admin | Aggregate dashboard business intelligence |
| `GET` | `/api/admin/users` | Admin | Administrative user directory |
| `GET` | `/api/admin/bookings` | Admin | Administrative master bookings registry |

---

## 11. Demo Credentials

The platform includes pre-configured demo accounts for fast evaluations:

| Portal | Email | Password | Role Features |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@demo.com` | `Demo@123456` | Search help, book services, mock escrow payment |
| **Worker** | `worker@demo.com` | `Demo@123456` | Toggle availability, accept bookings, complete jobs |
| **Admin** | `admin@grihseva.com` | `Admin@123456` | Platform analytics, user control, verification queue |

> **Tip:** The Login Page features **1-Click Autofill Buttons** to instantly populate credentials for any role during presentations.

---

## 12. Screenshots Section

| Customer Landing Page & Search | Worker Profile & Verification |
| :---: | :---: |
| *Hero section with instant Gemini AI NLP requirement search bar* | *Detailed experience metrics, verified badges, and reviews* |

| Customer Booking Wizard | Admin Analytics Dashboard |
| :---: | :---: |
| *4-step wizard with service scheduling and address picker* | *Interactive Recharts revenue, booking status, and category trends* |

---

## 13. Local Execution Instructions

### Run Backend
```bash
cd backend
npm run dev
# Server listening on http://localhost:5000
```

### Run Frontend
```bash
cd frontend
npm start
# Client running on http://localhost:3000
```

---

## 14. Deployment Instructions

### Backend (Render Web Service)
1. Link your GitHub repository (`KumarSamratSingh1/KaamConnect`).
2. Set Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Configure environment variables in the Render dashboard:
   - `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_*`, `GEMINI_API_KEY`, `CLIENT_URL` (your Vercel URL).

### Frontend (Vercel)
1. Import repository on Vercel.
2. Set Root Directory: `frontend`
3. Framework Preset: `Create React App`
4. Build Command: `npm run build`
5. Environment Variables:
   - `REACT_APP_API_URL`: `https://<your-render-backend>.onrender.com/api`
   - `REACT_APP_SOCKET_URL`: `https://<your-render-backend>.onrender.com`

---

## 15. Acknowledgements

This academic semester project was developed and expanded upon the architectural foundation of the open-source [grihseva](https://github.com/ADITYACHAUGAONKAR/grihseva) repository by Aditya Chaugaonkar. The project has undergone a complete frontend redesign, re-architecture of branding to KaamConnect, responsive UI upgrades, production deployment enhancements, and full functional testing for the Full Stack Development (FSD II) semester curriculum.

---

*KaamConnect — Built with ❤️ for India 🇮🇳*
