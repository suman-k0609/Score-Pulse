#  ScorePulse - Real-Time Sports Scoreboard

<div align="center">

![ScorePulse Banner](https://img.shields.io/badge/ScorePulse-FF6B35?style=for-the-badge&logo=pulse&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

**A modern, real-time sports scoreboard platform showcasing live basketball and football matches with advanced search, standings, and user preferences.**

[ Features](#-features)  [ Quick Start](#-quick-start)  [ Documentation](#-documentation)  [ Contributing](#-contributing)

</div>

---

##  Live Preview

`
 Dashboard   Real-time Events   Search & Filter   Standings   Favorites
`

### Key Pages:
- **Dashboard**: Browse all live, upcoming, and completed matches
- **Search**: Advanced filtering by team, sport, date, and status
- **Standings**: Auto-calculated league tables with win-loss-draw records
- **Event Details**: Live scoreboard with commentary and match history

---

##  Features

###  Core Features
-  **Real-Time Updates** - Socket.IO WebSocket integration for live scores
-  **Multi-Sport Support** - Basketball, Football, Cricket, Tennis ready
-  **Real API Data** - Live data from Basketball API & RapidAPI (Football)
-  **Advanced Search** - Filter by team, sport, venue, date, and status
-  **League Standings** - Auto-calculated rankings with goal difference
-  **Live Commentary** - Event-based commentary and history tracking
-  **User Authentication** - Secure JWT-based login/signup system
-  **Favorite Events** - Save and track favorite teams and matches
-  **Responsive Design** - Mobile-optimized dark theme UI
-  **Real Data Sync** - Automatic 30-second sync from live APIs

###  Technical Highlights
- **Real-Time Communication**: Socket.IO for instant score updates
- **Dual API Integration**: Basketball API + RapidAPI for football data
- **Scalable Architecture**: MongoDB with Mongoose ODM
- **Secure Authentication**: JWT tokens with bcrypt password hashing
- **Live Sync Service**: Background job to sync real game data
- **Error Handling**: Comprehensive error management and logging
- **Rate Limiting**: Graceful handling of API rate limits

---

##  Tech Stack

### Backend
\\\
Node.js + Express.js
MongoDB + Mongoose
Socket.IO v4.7.2
JWT + Bcrypt Authentication
Axios (API Integration)
Dotenv (Environment Management)
\\\

### Frontend
\\\
React 18
React Router v6
Tailwind CSS v3 (Dark Theme)
Axios + Interceptors
Socket.IO Client
React Context API (AuthContext)
React Icons
React Toastify (Notifications)
\\\

### APIs
\\\
 Basketball API (api-sports.io)
 RapidAPI Football (api-football-v1.p.rapidapi.com)
\\\

---

##  Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Installation

#### 1 Clone the Repository
\\\ash
git clone https://github.com/yourusername/Sports-Adda.git
cd Sports-Adda
\\\

#### 2 Backend Setup
\\\ash
cd backend
npm install
npm start
\\\

#### 3 Frontend Setup
\\\ash
cd frontend
npm install
npm start
\\\

#### 4 Access the Application
\\\
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
\\\

---

##  Documentation

### Project Structure

\\\
Sports-Adda/
 backend/
    models/                 # Database schemas
    routes/                # API endpoints
    middleware/            # Auth & utilities
    services/              # Business logic
    server.js              # Main server
    package.json

 frontend/
    src/
       pages/             # React pages
       components/        # Reusable components
       context/           # State management
       services/          # API & Socket
       App.js
    package.json

 README.md
\\\

### API Endpoints

####  Authentication
\\\ash
POST   /api/signup              # Create new user
POST   /api/login               # Login user
\\\

####  Events
\\\ash
GET    /api/events              # Get all events
GET    /api/events/:id          # Get event details
\\\

####  Search & Filter
\\\ash
GET    /api/search                    # Search events
GET    /api/search/sports/all         # Get all sports
\\\

####  Standings
\\\ash
GET    /api/standings/:sport    # Get league standings
\\\

####  Preferences
\\\ash
POST   /api/user/favorites/add/:eventId
GET    /api/user/favorites
\\\

---

##  Current Data

### Real Sports Events (18 Total)
- **Basketball**: 11 real NBA Summer League games
- **Football**: 7 realistic Premier League/La Liga/Bundesliga matches

---

##  Project Stats

-  Real-time Updates via Socket.IO
-  Multi-Sport Support
-  Advanced Search & Filtering
-  Auto-calculated Standings
-  JWT Authentication
-  User Favorites System
-  Responsive Dark Theme UI

---

##  Contributing

We love contributions! Please:
1. Fork the repository
2. Create feature branch (\git checkout -b feature/amazing\)
3. Make changes
4. Push to branch (\git push origin feature/amazing\)
5. Open a Pull Request

---

##  License

MIT License -  2024 Sports Adda

---

<div align="center">

###  Star this repository if you found it useful! 

Made with  by Aryan

</div>
