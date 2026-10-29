# Resume Project Description — KaamConnect

## One-liner (for Skills section)
**KaamConnect** — Full Stack MERN domestic worker marketplace (MongoDB, Express, React, Node.js, Socket.io, Redux Toolkit, JWT, AI)

---

## Short Description (3–4 lines — for Resume Projects section)

**KaamConnect – Domestic Worker Marketplace** | MERN Stack | [GitHub Link] | [Live Demo]

Built a production-ready web platform connecting Indian home owners with verified domestic workers (maids, cooks, babysitters). Implemented Uber-style real-time booking using Socket.io, AI-powered worker matching with Google Gemini API, JWT auth with refresh token rotation, and Cloudinary file uploads. Designed scalable MongoDB schemas with geospatial indexing and 50+ REST APIs with rate limiting, validation, and role-based access control.

**Tech Stack:** MongoDB · Express.js · React.js · Node.js · Socket.io · Redux Toolkit · Tailwind CSS · Framer Motion · JWT · Cloudinary · Recharts · Google Gemini API

---

## Detailed Description (for LinkedIn / Portfolio)

**KaamConnect** is a startup-grade domestic help platform I built end-to-end as a full stack project. It solves the real Indian problem of finding reliable household workers by combining Uber-style instant booking, matrimonial-style profile matching, and a modern service marketplace.

**Key Technical Achievements:**
- Engineered a RESTful backend with 50+ endpoints across 10 domains (auth, workers, bookings, reviews, chat, payments, AI, admin, notifications) with proper error handling, rate limiting, and security headers
- Built an AI matching engine using Google Gemini API that parses plain-language requirements ("I need a morning cook who speaks Hindi") and ranks workers by compatibility score
- Implemented real-time features with Socket.io: instant booking notifications, live chat between customers and workers, typing indicators, and availability status updates
- Designed MongoDB schemas with geospatial indexing (2dsphere) for location-based worker discovery and a full booking status machine with audit trail
- Implemented JWT authentication with refresh token rotation and role-based access control for 3 user types (Customer, Worker, Admin)
- Built a React frontend with Redux Toolkit, Framer Motion animations, dark/light mode, and a multi-step booking wizard

---

## Talking Points for Interviews

1. **Architecture Decision**: "I chose to separate User and WorkerProfile into two MongoDB collections to keep auth concerns separate from domain data, allowing clean role-based queries."

2. **Real-time Design**: "Socket.io rooms are organized by userId and conversationId — this ensures booking notifications are private while chat messages go to the right conversation."

3. **AI Integration**: "The Gemini API call is wrapped with a keyword-fallback parser — so the feature degrades gracefully if the API is unavailable or rate-limited."

4. **Security**: "I implemented rate limiting on auth routes (10 req/15min), helmet for security headers, CORS whitelist, and bcrypt with 12 salt rounds."

5. **Scalability**: "The folder structure is designed for microservices — each domain (bookings, workers, payments) can be split into independent services as traffic grows."
