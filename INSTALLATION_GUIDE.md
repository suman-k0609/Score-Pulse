# 🚀 Installation & Setup Guide

## Complete Step-by-Step Setup for ScorePulse

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14 or higher ([Download](https://nodejs.org/))
- **MongoDB**: Either local instance or MongoDB Atlas cloud ([Guide](https://docs.mongodb.com/manual/installation/))
- **Git**: ([Download](https://git-scm.com/))
- **npm or yarn**: Comes with Node.js

### Verify Installation

```bash
node --version
npm --version
git --version
mongod --version
```

---

## 🔑 Get API Keys

### 1. Basketball API Key

1. Visit [api-sports.io](https://api-sports.io/)
2. Create a free account
3. Navigate to Dashboard
4. Copy your **API Key**
5. Add to `.env` as `MAJOR_SPORTS_KEY`

### 2. RapidAPI Key

1. Visit [RapidAPI](https://rapidapi.com/)
2. Sign up for free account
3. Search for "Football" API
4. Subscribe to **api-football-v1** (free tier)
5. Copy **API Key** and **Host**
6. Add to `.env` as:
   - `RAPIDAPI_KEY`
   - `RAPIDAPI_HOST`

---

## ⚙️ Backend Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/ScorePulse.git
cd ScorePulse/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- express
- mongoose
- socket.io
- jwt
- bcrypt
- axios
- dotenv
- cors

### Step 3: Create `.env` File

Create a file named `.env` in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/ScorePulse

# JWT Authentication
JWT_SECRET=your_super_secret_key_change_this_in_production_at_least_32_chars

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Basketball API (api-sports.io)
MAJOR_SPORTS_KEY=your_api_sports_key_here
BASKETBALL=https://v1.basketball.api-sports.io/

# RapidAPI Football
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=api-football-v1.p.rapidapi.com
```

### Step 4: Database Setup

**Option A: Local MongoDB**

```bash
# Start MongoDB service
mongod

# MongoDB will run on mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Replace `MONGO_URL` in `.env`

### Step 5: Seed Real Game Data

```bash
# This populates database with real basketball and football games
node seedRealGames.js

# Expected output:
# 🔑 RapidAPI Key loaded: ✅
# ✅ Connected to MongoDB
# ✅ Basketball: 11 events created
# ✅ Football: 7 events created
# ✅ SEEDING COMPLETE!
```

### Step 6: Start Backend Server

```bash
npm start

# Expected output:
# Connected to MongoDB
# 🚀 Starting live game sync service...
# ✅ Live sync service started (live updates every 30 seconds)
# Server is running on port 5000
```

**Backend is now running on**: `http://localhost:5000`

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

Installs React, React Router, Axios, Socket.IO Client, Tailwind CSS, etc.

### Step 3: Create `.env` File (Optional)

Frontend `.env` (optional - uses localhost by default):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 4: Start Frontend

```bash
npm start

# React will open browser at http://localhost:3000
# If not, visit manually
```

---

## ✅ Verify Installation

### Check Backend API

```bash
# In new terminal
curl http://localhost:5000/api/events

# Should return JSON list of events
```

### Check Frontend

1. Open browser: `http://localhost:3000`
2. You should see the login page
3. Sign up or create account
4. See the dashboard with 18 real events

---

## 🎯 First Time Usage

### 1. Create Account

- Go to `http://localhost:3000/signup`
- Enter username, email, password
- Click "Sign Up"

### 2. Login

- Email and password
- Click "Login"

### 3. Explore Dashboard

- View 18 real sports events
- See basketball and football matches
- Check live updates

### 4. Try Features

- **Search**: Find specific teams or events
- **Standings**: View league tables
- **Event Details**: Click any event to see details
- **Favorites**: Add events to your favorites

---

## 🐛 Troubleshooting

### Problem: MongoDB Connection Error

**Error**: `MongooseError: Cannot connect to MongoDB`

**Solution**:
```bash
# Check if MongoDB is running
mongod

# Or verify MONGO_URL in .env is correct
# For local: mongodb://localhost:27017/Sports_Adda
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/Sports_Adda
```

### Problem: API Key Not Working

**Error**: `429 Too Many Requests` or `401 Unauthorized`

**Solution**:
- Verify API keys in `.env`
- Check API rate limits (free tier limited)
- Get keys from correct services:
  - Basketball: api-sports.io
  - Football: RapidAPI → api-football-v1

### Problem: CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL
- Check `http://localhost:3000` is exactly correct
- Restart backend after changing `.env`

### Problem: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change PORT in .env to 5001
```

### Problem: Dependencies Not Installing

**Error**: `npm ERR! ...`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules package-lock.json

# Reinstall
npm install
```

---

## 📦 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment type | `development` / `production` |
| `MONGO_URL` | Database connection string | `mongodb://localhost:27017/Sports_Adda` |
| `JWT_SECRET` | Secret key for JWT tokens | Long random string |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `MAJOR_SPORTS_KEY` | Basketball API key | From api-sports.io |
| `RAPIDAPI_KEY` | RapidAPI key | From rapidapi.com |
| `RAPIDAPI_HOST` | RapidAPI host | `api-football-v1.p.rapidapi.com` |

---

## 📁 Project Structure After Setup

```
Sports-Adda/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── .env                    ← Your config
│   ├── server.js
│   ├── seedRealGames.js
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                    ← Optional
│   ├── package.json
│   ├── node_modules/
│   └── public/
│
└── README.md
```

---

## 🚀 Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

### Terminal 3: Database (if local MongoDB)
```bash
mongod
# Runs on port 27017
```

---

## 📝 Next Steps

After setup, try:

1. **Add More Events**: Extend `seedRealGames.js` with cricket/tennis
2. **Customize Theme**: Modify Tailwind config
3. **Deploy**: Push to Heroku, Vercel, or Railway
4. **Add Features**: Implement notifications, admin panel, etc.

---

## 🆘 Need Help?

- **Check Logs**: Look at terminal output for errors
- **GitHub Issues**: Open issue on repository
- **Documentation**: Read backend/API_DOCS.md
- **Environment**: Verify all `.env` variables are set

---

## ✨ Congratulations!

Your Sports Adda application is now ready! 🎉

Visit `http://localhost:3000` to start using it.

---

<div align="center">

Made with ❤️ by Aryan

</div>
