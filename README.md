# 🏠 KaamConnect — Domestic Worker Platform

> **Tagline:** *Your Home. Your Help. One Connection.*  
> A premium full-stack MERN marketplace connecting households with trusted, background-verified domestic workers.
> Think **Rapido × Matrimonial** for home services in India.

![Stack](https://img.shields.io/badge/Stack-MERN-orange?style=flat-square) ![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square) ![Made in India](https://img.shields.io/badge/Made%20in-India-green?style=flat-square)

---

## Demo Credentials

| Role     | Email               | Password     |
|----------|---------------------|--------------|
| Customer | customer@demo.com   | Demo@1234    |
| Worker   | savita@demo.com     | Demo@1234    |
| Admin    | admin@kaamconnect.com  | Admin@123456 |

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io, JWT, Cloudinary, Multer, Helmet, Rate Limiter

**Frontend:** React 18, Redux Toolkit, React Router v6, Tailwind CSS, Framer Motion, Recharts, Socket.io-client, Axios

**AI/Integrations:** Google Gemini API, Razorpay (mock), Cloudinary, Google Maps API

---

## Quick Start

### 1. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment
```bash
cd backend && cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, CLOUDINARY_* keys
```

### 3. Seed database
```bash
cd backend && npm run seed
```

### 4. Start servers
```bash
# Terminal 1
cd backend && npm run dev    # Runs on :5000

# Terminal 2
cd frontend && npm start     # Runs on :3000
```

---

## Project Structure

```
kaamconnect/
├── backend/
│   ├── config/          db.js, cloudinary.js
│   ├── controllers/     auth, worker, booking, admin, ai
│   ├── middleware/       auth (JWT + roles), errorHandler
│   ├── models/          User, WorkerProfile, Booking, Review, Chat, Notification
│   ├── routes/          10 route files (REST APIs)
│   ├── socket/          socketHandler.js (Socket.io events)
│   ├── utils/           jwt.js, seed.js
│   └── server.js        Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  Navbar, WorkerCard, StarRating, BookingStatusBadge, LoadingScreen
    │   ├── pages/       15 pages across customer/worker/admin/shared/auth
    │   ├── store/       Redux store + 5 slices
    │   ├── utils/       api.js (axios+interceptors), socket.js, helpers.js
    │   └── styles/      Tailwind + custom CSS design tokens
    └── App.js           Route guards + role-based routing
```

---

## Core Features

### For Customers
- AI-powered requirement parser (plain English → search filters)
- Smart worker matching with Gemini API scoring
- Instant / Scheduled / Emergency / Recurring bookings
- Real-time booking status updates via Socket.io
- Live chat with workers
- Razorpay payment integration
- Rating & review system

### For Workers
- Detailed profile with skills, availability, salary range
- Aadhaar + background check verification flow
- Real-time booking notifications (accept/reject)
- Service start/complete workflow with OTP
- Earnings & stats dashboard

### For Admins
- Analytics dashboard with Recharts (bookings, revenue, service trends)
- User management (block/unblock)
- Worker verification workflow
- All bookings management
- AI fraud risk monitoring

---

## API Highlights

```
POST   /api/auth/register         → Register (customer/worker)
POST   /api/auth/login            → Login + JWT tokens
GET    /api/workers               → List with 10+ filter params
GET    /api/workers/:id           → Profile + reviews
POST   /api/bookings              → Create booking
PATCH  /api/bookings/:id/respond  → Accept/Reject (worker)
POST   /api/ai/match              → AI-powered worker matching
POST   /api/ai/parse-requirement  → NLP: plain text → filters
POST   /api/ai/assistant          → AI chat assistant
GET    /api/admin/stats           → Analytics aggregation
```

---

## MongoDB Schema Highlights

- **User** — GeoJSON coordinates, bcrypt password, refresh tokens, report system
- **WorkerProfile** — Skills[], rating breakdown, AI fraud score, profile completion, verification badges
- **Booking** — 10-state lifecycle, statusHistory[], pricing breakdown with GST, GeoJSON service location
- **Review** — AI sentiment analysis fields, helpful votes, owner response
- **Conversation + Message** — Real-time chat, read receipts, typing indicators

---

## Socket.io Events

```
new_booking_request    Server → Worker room
booking_response       Server → Customer room
new_message            Server → Conversation room
notification           Server → User personal room
user_typing            Peer broadcast in conversation
worker_availability    Broadcast to all
```

---

## Deployment

### Backend → Railway / Render
Set env vars → Deploy from GitHub → Done

### Frontend → Vercel
```
Build: npm run build
Publish: build/
REACT_APP_API_URL=https://your-backend-url/api
```

### MongoDB → Atlas
Free M0 cluster → Connection string → MONGODB_URI

---

## Resume Description

**KaamConnect — Domestic Worker Marketplace** | MERN Stack

Built a full-stack platform for India's domestic service market from scratch, featuring: geo-indexed MongoDB schemas for location-based search, real-time booking lifecycle with Socket.io room broadcasting, AI-powered matching using Google Gemini API for NLP requirement parsing and worker scoring, JWT authentication with automatic refresh and role-based access (customer/worker/admin), Cloudinary integration for document uploads, Razorpay payment flow, and an admin analytics dashboard with MongoDB aggregation pipelines.

**Stack:** MongoDB · Express.js · React.js · Node.js · Socket.io · Redux Toolkit · Tailwind CSS · Framer Motion · Recharts · JWT · Cloudinary · Google Gemini API · Razorpay

---

## Future Scope

1. React Native mobile app
2. Live GPS worker tracking on Google Maps
3. Video KYC verification
4. Hindi/regional language UI
5. Worker skill certification courses
6. ML-based demand prediction by area
7. Monthly subscription plans
8. Worker accident insurance integration

---

---

*Made with ❤️ in India 🇮🇳*
