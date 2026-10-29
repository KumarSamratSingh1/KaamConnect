# 🌐 KaamConnect Production Deployment Guide

This guide provides end-to-end instructions for deploying **KaamConnect** to production using **Render** (Backend), **Vercel** (Frontend), and **MongoDB Atlas** (Database).

---

## Architecture Overview

* **Database:** MongoDB Atlas (Free Tier M0 or Shared Cluster)
* **Backend:** Render Web Service (Node.js runtime, Root: `backend`)
* **Frontend:** Vercel (Create React App SPA, Root: `frontend`)
* **Media Storage:** Cloudinary
* **AI Engine:** Google Gemini Flash API

---

## Step 1: MongoDB Atlas Database Setup

1. **Log in** to your [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. **Network Access Configuration:**
   * Navigate to **Security &rarr; Network Access**.
   * Click **Add IP Address**.
   * Select **Allow Access from Anywhere** (`0.0.0.0/0`) or enter Render's outbound IP addresses.
   * *Why?* Cloud providers like Render dynamically allocate outbound IP addresses; allowing `0.0.0.0/0` ensures uninterrupted database connectivity while keeping your database protected by your database user credentials.
3. **Database User Verification:**
   * Navigate to **Security &rarr; Database Access**.
   * Confirm you have a database user with **Read and write to any database** permissions.
4. **Retrieve Connection String:**
   * Navigate to **Database &rarr; Clusters &rarr; Connect &rarr; Drivers (Node.js)**.
   * Copy the connection URI:
     ```
     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kaamconnect?retryWrites=true&w=majority
     ```

---

## Step 2: Deploy Backend to Render

1. **Sign in** to [Render](https://render.com/).
2. Click **New + &rarr; Web Service**.
3. Connect your GitHub repository: `KumarSamratSingh1/KaamConnect`.
4. Configure service parameters:
   * **Name:** `kaamconnect-backend` (or your preferred name)
   * **Region:** Singapore / Frankfurt / Oregon (choose closest to your audience)
   * **Branch:** `main`
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
   * **Instance Type:** `Free`
5. **Environment Variables:**
   Under **Environment Variables**, add the following keys:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `PORT` | `5000` | (Render automatically sets `PORT`, but `server.js` handles both) |
   | `NODE_ENV` | `production` | Enables production security and disables dev logger |
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | *(Random 32+ character string)* | Sign access tokens |
   | `JWT_EXPIRES_IN` | `7d` | Token lifetime |
   | `JWT_REFRESH_SECRET`| *(Random 32+ character string)* | Sign refresh tokens |
   | `JWT_REFRESH_EXPIRES_IN`| `30d` | Refresh token lifetime |
   | `CLOUDINARY_CLOUD_NAME`| `vhsjqxzw` | Your Cloudinary Cloud Name |
   | `CLOUDINARY_API_KEY` | `662326261531983` | Your Cloudinary API Key |
   | `CLOUDINARY_API_SECRET`| `HDeSlwXAx0i5QZp0Qn_odC85sHc` | Your Cloudinary API Secret |
   | `GEMINI_API_KEY` | `AQ.Ab8RN6Kds5zwk-...` | Your Google Gemini API Key |
   | `CLIENT_URL` | `https://kaamconnect.vercel.app` | *(Add your actual Vercel URL after Step 3)* |

6. Click **Deploy Web Service**.
7. Once deployed, copy your live backend URL (e.g. `https://kaamconnect-backend.onrender.com`).
8. Test the health check endpoint in your browser:
   `https://kaamconnect-backend.onrender.com/api/health`
   Should return: `{"success":true,"message":"KaamConnect API is running 🏠"}`.

---

## Step 3: Deploy Frontend to Vercel

1. **Sign in** to [Vercel](https://vercel.com/).
2. Click **Add New... &rarr; Project**.
3. Import your GitHub repository: `KumarSamratSingh1/KaamConnect`.
4. Configure project settings:
   * **Framework Preset:** `Create React App`
   * **Root Directory:** Click `Edit` and select `frontend`.
   * **Build Command:** `npm run build`
   * **Output Directory:** `build`
5. **Environment Variables:**
   Expand **Environment Variables** and add:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `REACT_APP_API_URL` | `https://kaamconnect-backend.onrender.com/api` | Point to your Render backend API |
   | `REACT_APP_SOCKET_URL` | `https://kaamconnect-backend.onrender.com` | Point to your Render backend root |

6. Click **Deploy**.
7. Once deployment finishes, Vercel will provide your production domain (e.g., `https://kaam-connect.vercel.app`).

---

## Step 4: Finalize CORS Configuration

1. Copy your live Vercel frontend URL (e.g., `https://kaam-connect.vercel.app`).
2. Go back to your [Render Dashboard](https://dashboard.render.com/) &rarr; `kaamconnect-backend` &rarr; **Environment**.
3. Update `CLIENT_URL` with your live frontend domain:
   ```env
   CLIENT_URL=https://kaam-connect.vercel.app
   ```
4. Click **Save Changes**. Render will automatically redeploy with the updated CORS origin.

---

## Step 5: Verify Live Application

1. Open your Vercel URL in your browser.
2. Verify the landing page loads cleanly with emerald green theme and Lucide icons.
3. Test **1-Click Demo Login** on `/login`:
   * Login as **Customer** (`customer@demo.com`) &rarr; browse workers and test booking wizard.
   * Login as **Worker** (`worker@demo.com`) &rarr; toggle availability and inspect assigned jobs.
   * Login as **Admin** (`admin@grihseva.com`) &rarr; inspect live platform analytics and users list.
4. Test the **AI Smart Requirement Search** on the landing page:
   * Type: *"I need a cook and cleaner for morning shift"* &rarr; verify results filter dynamically.
