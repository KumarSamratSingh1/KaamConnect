# KaamConnect Deployment Guide

## Option 1: Render (Backend) + Vercel (Frontend) — FREE

### Step 1: MongoDB Atlas
1. Go to https://mongodb.com/atlas and create a free M0 cluster
2. Create a database user
3. Set Network Access to `0.0.0.0/0`
4. Copy the connection string: `mongodb+srv://user:pass@cluster.mongodb.net/kaamconnect`

### Step 2: Cloudinary
1. Create account at https://cloudinary.com
2. Copy Cloud Name, API Key, API Secret from dashboard

### Step 3: Deploy Backend to Render
1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect GitHub repo → select `backend` folder
4. Settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node
5. Add all environment variables from `.env.example`
6. Deploy → note the URL: `https://kaamconnect-api.onrender.com`

### Step 4: Deploy Frontend to Vercel
1. Go to https://vercel.com → New Project
2. Connect GitHub repo → select `frontend` folder
3. Add environment variables:
   ```
   REACT_APP_API_URL=https://kaamconnect-api.onrender.com/api
   REACT_APP_SOCKET_URL=https://kaamconnect-api.onrender.com
   ```
4. Build Command: `npm run build`
5. Output Directory: `build`
6. Deploy!

### Step 5: Seed demo data
```bash
cd backend
MONGODB_URI=your_atlas_uri npm run seed
```

---

## Option 2: Docker Compose (Local/VPS)

```yaml
# docker-compose.yml
version: '3.8'
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]
  backend:
    build: ./backend
    ports: ["5000:5000"]
    environment:
      - MONGODB_URI=mongodb://mongo:27017/kaamconnect
    depends_on: [mongo]
  frontend:
    build: ./frontend
    ports: ["3000:80"]
    depends_on: [backend]
volumes:
  mongo_data:
```

```bash
docker-compose up --build
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (min 32 chars)
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set up Cloudinary upload presets
- [ ] Configure CORS for production domain
- [ ] Add Google Gemini API key
- [ ] Enable Razorpay live keys (when ready)
- [ ] Set up monitoring (Render auto-restart)
- [ ] Run `npm run seed` for demo data
