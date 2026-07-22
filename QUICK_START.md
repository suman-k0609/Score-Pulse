# ScorePulse - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start Backend Server
```bash
cd backend
npm install
npm start
# Server starts on http://localhost:5000 (Connected to MongoDB & Live Sync Engine)
```

### Step 2: Start Frontend Application
```bash
cd frontend
npm install
npm start
# Application runs at http://localhost:3000
```

### Step 3: Test the Application
1. Open [`http://localhost:3000`](http://localhost:3000) in your browser.
2. Sign up or log in to view your personalized dashboard.
3. Observe live matches across **Football, Basketball, Tennis, and Cricket**.
4. Check **League Standings** (`/standings`) for multi-sport leaderboards.
5. Verify your **Username** displayed in the navigation bar.

---

## 📁 Key Project Files

### Backend:
- `backend/services/liveSync.js` - Real multi-sport data sync engine (`getMatchStatus`)
- `backend/models/event.js` - Mixed score type schema
- `backend/routes/standings_routes.js` - Standings leaderboard calculator
- `backend/controller/eventcontroller.js` - Event CRUD & auto-status evaluator
- `backend/server.js` - Server entry point with Socket.IO & DNS configuration

### Frontend:
- `frontend/src/components/Navbar.js` - Floating glass navbar with username display
- `frontend/src/components/EventCard.js` - Match preview card with live dot badges
- `frontend/src/pages/Dashboard.js` - Hero stats dashboard with sports filter pills
- `frontend/src/pages/StandingsPage.js` - Metallic rank standings leaderboard
- `frontend/src/pages/EventDetailPage.js` - Live score cards and match timeline
