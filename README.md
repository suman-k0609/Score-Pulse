# ScorePulse - Real-Time Sports Scoreboard

<div align="center">

![ScorePulse Badge](https://img.shields.io/badge/ScorePulse-FF6B35?style=for-the-badge&logo=pulse&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

**A modern, real-time sports scoreboard platform with live basketball and football matches, advanced search, league standings, and real-time updates via WebSockets.**

[Features](#features) • [Quick Start](#quick-start) • [Installation](#installation) • [API Documentation](#api-documentation) • [Architecture](#architecture) • [Contributing](#contributing)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**ScorePulse** is a full-stack real-time sports scoreboard application featuring live basketball and football matches. Users can follow live sports events, view real-time scores, track league standings, and stay updated with event history and commentary.

**Status:** ✅ Ready for Production

### Key Features
- 🎯 Dashboard with live, upcoming, and completed matches
- 🔍 Advanced search and filtering capabilities
- 🏆 Auto-calculated league standings
- 📊 Event details with live scoreboard
- 💬 Live commentary and event history
- ❤️ Save and track favorite teams and matches
- 🔐 Secure user authentication with JWT
- 📱 Fully responsive mobile-first design
- ⚡ Real-time updates via WebSockets
- 🌙 Dark theme UI

---

## Features

### Dashboard
- Browse all live, upcoming, and completed sports events
- Filter by sport (Basketball, Football, Cricket, Tennis)
- Filter by status (Upcoming, Live, Completed)
- Real-time score updates every 30 seconds
- Quick view of team names, scores, and venues
- Click to view detailed scoreboard

### Advanced Search
- Text search by team name, venue, or event name
- Multiple filter criteria (sport, status, team)
- Pagination support (12 events per page)
- Sort options (date, name, score)
- Results across basketball and football

### League Standings
- Auto-calculated league tables from match results
- Multi-sport support (basketball, football)
- Points system:
  - Win = 3 points
  - Draw = 1 point
  - Loss = 0 points
- Metrics displayed:
  - Rank, Games Played, Wins, Draws, Losses
  - Goals For/Against, Goal Difference
  - Total Points
- Color-coded goal differences

### Event Details & Scoreboard
- Live score display for both teams
- Real-time score updates via WebSocket
- Event timeline with timestamps
- Event history and match events
- Live commentary system
- Follow/unfollow button
- Followers count tracking
- Mobile responsive layout

### User Authentication
- Secure registration and login system
- JWT token-based authentication
- Bcrypt password hashing (10 salt rounds)
- Auto-logout after inactivity
- Protected routes
- Session management via localStorage

### Favorites System
- Save favorite events and teams
- Personalized event collection
- Quick access to tracked matches
- Real-time notifications for favorites
- Manage favorites from dashboard

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.IO v4.7.2
- **Authentication:** JWT + Bcrypt
- **API Integration:** Axios
- **Environment:** Dotenv

**Key Dependencies:**
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "socket.io": "^4.7.2",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "axios": "^1.3.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3"
}
```

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3
- **HTTP Client:** Axios with interceptors
- **Real-time:** Socket.IO Client
- **State Management:** React Context API
- **UI Icons:** React Icons
- **Notifications:** React Toastify

**Key Dependencies:**
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.10.0",
  "tailwindcss": "^3.2.7",
  "axios": "^1.3.0",
  "socket.io-client": "^4.5.4",
  "react-icons": "^4.7.1",
  "react-toastify": "^9.1.2"
}
```

### External APIs
- **Basketball API:** api-sports.io
- **Football API:** RapidAPI (api-football-v1)

---

## Project Structure

```
ScorePulse/
├── backend/
│   ├── controller/
│   │   ├── user_auth.js          # User authentication logic
│   │   ├── eventcontroller.js    # Event CRUD operations
│   │   ├── livecontroller.js     # Live score operations
│   │   └── basketballcontroller.js
│   ├── models/
│   │   ├── user.js               # User schema
│   │   ├── event.js              # Event schema
│   │   └── followedEvent.js      # User follows relationship
│   ├── routes/
│   │   ├── user_routes.js
│   │   ├── event_routes.js
│   │   ├── live_routes.js
│   │   ├── basketball_routes.js
│   │   ├── search_routes.js
│   │   ├── standings_routes.js
│   │   └── preferences_routes.js
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── services/
│   │   ├── liveSync.js          # Real-time sync service
│   │   └── rapidAPI.js          # API integration
│   ├── server.js                # Main server setup
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Navigation component
│   │   │   └── EventCard.js      # Event preview card
│   │   ├── context/
│   │   │   └── AuthContext.js    # Global auth state
│   │   ├── pages/
│   │   │   ├── LoginPage.js      # Authentication
│   │   │   ├── SignupPage.js     # Registration
│   │   │   ├── Dashboard.js      # Event listing
│   │   │   ├── EventDetailPage.js # Scoreboard
│   │   │   ├── SearchPage.js     # Search & filter
│   │   │   ├── StandingsPage.js  # League standings
│   │   │   └── NotFound.js       # 404 page
│   │   ├── services/
│   │   │   ├── api.js            # API client layer
│   │   │   └── socket.js         # WebSocket management
│   │   ├── App.js                # Main routing
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md                      # This file
```

---

## Installation

### Prerequisites
- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **MongoDB** local instance or MongoDB Atlas cloud ([Guide](https://docs.mongodb.com/manual/installation/))
- **Git** ([Download](https://git-scm.com/))
- **npm** or **yarn** (comes with Node.js)

### Verify Installation
```bash
node --version
npm --version
git --version
```

### Get API Keys

#### Basketball API (api-sports.io)
1. Visit [api-sports.io](https://api-sports.io/)
2. Create a free account
3. Navigate to Dashboard
4. Copy your **API Key**
5. Save as `MAJOR_SPORTS_KEY` in `.env`

#### Football API (RapidAPI)
1. Visit [RapidAPI](https://rapidapi.com/)
2. Sign up for free account
3. Search for "Football" API
4. Subscribe to **api-football-v1** (free tier)
5. Copy **API Key** and **Host**
6. Save as `RAPIDAPI_KEY` and `RAPIDAPI_HOST` in `.env`

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/ScorePulse.git
cd ScorePulse/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/ScorePulse
JWT_SECRET=your_super_secret_key_change_this_in_production_at_least_32_chars
FRONTEND_URL=http://localhost:3000
MAJOR_SPORTS_KEY=your_api_sports_key_here
BASKETBALL=https://v1.basketball.api-sports.io/
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=api-football-v1.p.rapidapi.com
EOF

# Ensure MongoDB is running
mongod

# Start backend server
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd ScorePulse/frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
EOF

# Start frontend app
npm start
# App opens at http://localhost:3000
```

---

## Quick Start

### 1. Start Backend
```bash
cd backend
npm install
npm start
```
Server will run on `http://localhost:5000`

### 2. Start Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```
App will open at `http://localhost:3000`

### 3. Test Application
1. Open http://localhost:3000 in browser
2. Click "Sign Up" to create test account
3. You'll be logged in and see the dashboard
4. Browse events and test features:
   - Filter by sport and status
   - Click events to see live scoreboard
   - Add events to favorites
   - Check league standings
   - Search for teams

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Authentication Endpoints

#### Register User
```
POST /register

Request:
{
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011"
}
```

#### Login User
```
POST /login

Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011"
}
```

### Event Endpoints

#### Get All Events
```
GET /events

Query Parameters:
- status: upcoming|live|completed
- sport: cricket|basketball|football|tennis

Example:
GET /events?sport=cricket&status=live
```

#### Get Event by ID
```
GET /events/:eventId
```

#### Create Event
```
POST /events
Authorization: Required

Body:
{
  "eventName": "India vs Pakistan",
  "sport": "cricket",
  "team1": { "name": "India", "score": 0 },
  "team2": { "name": "Pakistan", "score": 0 },
  "venue": "Dubai Stadium",
  "startTime": "2024-01-15T18:00:00Z",
  "status": "upcoming"
}
```

#### Update Event Score
```
PATCH /events/:eventId/score
Authorization: Required

Body:
{
  "team1Score": 150,
  "team2Score": 145
}
```

### Search Endpoints

#### Search Events
```
GET /search?search=Manchester&sport=football&status=completed&page=1
```

#### Get All Sports
```
GET /search/sports/all
```

### Standings Endpoints

#### Get League Standings
```
GET /standings/:sport

Example:
GET /standings/football
```

### Preferences Endpoints

#### Add to Favorites
```
POST /user/favorites/add/:eventId
Authorization: Required
```

#### Get Favorites
```
GET /user/favorites
Authorization: Required
```

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      INTERNET / USERS                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
  ┌─────────────────┐        ┌──────────────────────┐
  │ FRONTEND (3000) │        │   BACKEND (5000)     │
  │ React 18        │◄──HTTP─┤   Express.js + Node  │
  │ - Pages         │        │   - Controllers      │
  │ - Components    │        │   - Models           │
  │ - Services      │◄─WS────┤   - Routes           │
  │ - Context       │─WS────→│   - Middleware       │
  └─────────────────┘        │   - Services         │
        │                    └────────┬──────────────┘
        │                             │
        │          ┌──────────────────┘
        │          ▼
        │     ┌──────────────────┐
        │     │    MongoDB       │
        │     │ (Mongoose ODM)   │
        │     │                  │
        │     │ Collections:     │
        │     │ - users          │
        │     │ - events         │
        │     │ - followedevents │
        │     └──────────────────┘
        │
        └─ Socket.IO (Real-time)
           - join_event
           - leave_event
           - score_update
           - history_update
           - followers_update
```

### Authentication Flow
1. User submits login/signup form
2. Password hashed with bcrypt (10 rounds)
3. JWT token generated on success
4. Token stored in localStorage
5. Token sent in Authorization header for protected routes
6. Backend validates token via middleware

### Event Real-Time Updates
1. Frontend connects to WebSocket on mount
2. Joins specific event rooms
3. Receives instant score updates
4. History and commentary updates broadcast to all connected users
5. Automatic sync every 30 seconds from external APIs

---

## Development

### Frontend Development
```bash
cd frontend
npm install
npm start
```
Hot reload enabled - changes reflected instantly

### Backend Development
```bash
cd backend
npm install
npm start
```

### Database
```bash
# Start local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URL in .env
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/ScorePulse
JWT_SECRET=your_secret_key_min_32_chars
FRONTEND_URL=http://localhost:3000
MAJOR_SPORTS_KEY=api_key_here
BASKETBALL=https://v1.basketball.api-sports.io/
RAPIDAPI_KEY=api_key_here
RAPIDAPI_HOST=api-football-v1.p.rapidapi.com
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## Contributing

We welcome contributions! Here's how to get started:

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ScorePulse.git`
3. Create feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies and follow installation guide

### Development Setup
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### Making Changes
1. Write clean, readable code
2. Follow existing code style
3. Add comments for complex logic
4. Test thoroughly

### Submitting Changes
1. Commit changes: `git commit -m "Add amazing feature"`
2. Push to branch: `git push origin feature/amazing-feature`
3. Open Pull Request with description of changes

### Branch Naming
- Feature: `feature/add-cricket-api`
- Bug fix: `fix/search-pagination-bug`
- Documentation: `docs/update-readme`

### Code Standards
- Use meaningful variable names
- Keep functions focused and small
- Add JSDoc comments for functions
- Handle errors gracefully
- Write modular code

---

## Project Statistics

- **Backend:** Node.js + Express.js + MongoDB
- **Frontend:** React 18 + Tailwind CSS
- **Real-time:** Socket.IO WebSocket connections
- **Authentication:** JWT + Bcrypt
- **API Integration:** Basketball API + RapidAPI
- **Database:** MongoDB with Mongoose ODM
- **Styling:** Tailwind CSS v3 with dark theme
- **Total Features:** 20+
- **Sports Supported:** Basketball, Football, Cricket, Tennis

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

### MIT License
Copyright (c) 2024 ScorePulse

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

---

<div align="center">

### ⭐ If you found this project useful, please star it!

**Made with ❤️ by the ScorePulse Team**

[GitHub](https://github.com/yourusername/ScorePulse) • [Issues](https://github.com/yourusername/ScorePulse/issues) • [Discussions](https://github.com/yourusername/ScorePulse/discussions)

</div>
