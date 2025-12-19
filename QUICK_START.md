# Sports Adda - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
# Add your MongoDB URL and JWT secret:
# MONGO_URL=mongodb://localhost:27017/sports-adda
# JWT_SECRET=your_super_secret_key_here

# Start backend server
npm start
# Server will run on http://localhost:5000
```

### Step 2: Frontend Setup
```bash
# Navigate to frontend (in another terminal)
cd frontend

# Install dependencies
npm install

# Start frontend app
npm start
# App will open at http://localhost:3000
```

### Step 3: Test the Application
1. Open http://localhost:3000 in your browser
2. Click "Sign up" and create a test account
3. You'll be logged in and see the dashboard
4. Browse events and test features

---

## 📁 Project Files Summary

### Backend Files Added/Modified:
- ✅ `backend/server.js` - Added Socket.IO setup
- ✅ `backend/package.json` - Added socket.io dependency
- ✅ `backend/models/event.js` - NEW Event model
- ✅ `backend/models/followedEvent.js` - NEW FollowedEvent model
- ✅ `backend/controller/eventcontroller.js` - NEW Event CRUD controller
- ✅ `backend/routes/event_routes.js` - NEW Event API routes
- ✅ `backend/.env.example` - Environment template

### Frontend Files Created:
- ✅ `frontend/src/App.js` - Main routing component
- ✅ `frontend/src/index.js` - React entry point
- ✅ `frontend/src/index.css` - Global styles with Tailwind
- ✅ `frontend/src/context/AuthContext.js` - Auth state management
- ✅ `frontend/src/services/api.js` - API calls layer
- ✅ `frontend/src/services/socket.js` - WebSocket management
- ✅ `frontend/src/pages/LoginPage.js` - Login UI
- ✅ `frontend/src/pages/SignupPage.js` - Signup UI
- ✅ `frontend/src/pages/Dashboard.js` - Main dashboard
- ✅ `frontend/src/pages/EventDetailPage.js` - Event scoreboard
- ✅ `frontend/src/pages/NotFound.js` - 404 page
- ✅ `frontend/src/components/Navbar.js` - Navigation bar
- ✅ `frontend/src/components/EventCard.js` - Event card component
- ✅ `frontend/package.json` - Frontend dependencies
- ✅ `frontend/tailwind.config.js` - Tailwind configuration
- ✅ `frontend/.env.example` - Environment template

---

## 🎨 Frontend Features

### Pages
1. **Login Page** - User authentication with email/password
2. **Signup Page** - New account creation
3. **Dashboard** - Browse all events with filters
4. **Event Detail** - Live scoreboard with real-time updates
5. **NotFound** - 404 error page

### Components
1. **Navbar** - Navigation and user profile
2. **EventCard** - Reusable event preview card

### Services
1. **API Service** - Centralized API calls with Axios
2. **Socket Service** - WebSocket event management

### Context
1. **AuthContext** - Global authentication state

---

## 🔄 WebSocket Real-Time Features

The app automatically updates in real-time when:
- ✅ New events are created
- ✅ Event scores are updated
- ✅ Event status changes (upcoming → live → completed)
- ✅ Event history/commentary is added
- ✅ Follower count changes

---

## 🎯 API Endpoints

### Authentication
```
POST   /api/register              - Create new account
POST   /api/login                 - Login user
```

### Events
```
GET    /api/events                - Get all events (filter by sport/status)
GET    /api/events/:eventId       - Get event details
POST   /api/events                - Create event (admin)
PUT    /api/events/:eventId/score - Update score (admin)
PUT    /api/events/:eventId/status - Update status (admin)
POST   /api/events/:eventId/history - Add commentary (admin)
```

### Follow
```
POST   /api/events/:eventId/follow - Follow event
DELETE /api/events/:eventId/follow - Unfollow event
GET    /api/events/:eventId/is-following - Check follow status
GET    /api/events/user/followed-events - Get user's followed events
```

---

## 🛠️ Useful Commands

### Backend
```bash
# Start server
npm start

# Start with auto-reload (if nodemon installed)
npm run dev

# Install specific package
npm install package-name
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Install specific package
npm install package-name
```

---

## ⚙️ Configuration

### Backend Environment Variables (.env)
```
PORT=5000
MONGO_URL=mongodb://localhost:27017/sports-adda
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🐛 Common Issues & Solutions

### "MongoDB connection failed"
- Ensure MongoDB is running (mongodb://localhost:27017)
- Or update MONGO_URL with your MongoDB Atlas URL

### "CORS error"
- Check backend FRONTEND_URL matches your actual frontend URL
- Verify backend is running on correct port

### "WebSocket connection failed"
- Ensure backend server is running
- Check REACT_APP_SOCKET_URL in frontend .env

### Port already in use
```bash
# Kill process using port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process using port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🧪 Testing the Application

### 1. Create Event (via API)
```bash
# Create a test event using Postman or cURL
POST http://localhost:5000/api/events
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "eventName": "Test Match",
  "sport": "cricket",
  "team1": "Team A",
  "team2": "Team B",
  "startTime": "2024-01-15T15:00:00Z",
  "venue": "Stadium",
  "description": "Test event"
}
```

### 2. Update Score
```bash
PUT http://localhost:5000/api/events/EVENT_ID/score
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "team": "team1",
  "points": 10,
  "action": "Wicket"
}
```

### 3. Update Status to Live
```bash
PUT http://localhost:5000/api/events/EVENT_ID/status
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "live"
}
```

---

## 📱 Responsive Design

The application is fully responsive and works on:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

---

## 🎨 UI Highlights

- **Color Scheme**: Dark theme with blue/purple gradient
- **Icons**: React Icons
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Spinner animations
- **Error Handling**: Toast notifications

---

## 📚 Dependencies

### Backend
- express: Server framework
- mongoose: MongoDB ODM
- socket.io: Real-time communication
- jsonwebtoken: Authentication
- bcrypt: Password hashing
- cors: Cross-origin support
- axios: HTTP client

### Frontend
- react & react-dom: UI framework
- react-router-dom: Routing
- axios: API calls
- socket.io-client: WebSocket client
- tailwindcss: Styling
- react-icons: Icon library
- react-toastify: Notifications

---

## 🚀 Next Steps

1. **Test all features** with sample data
2. **Deploy backend** to cloud (Heroku, Railway, etc.)
3. **Deploy frontend** to hosting (Vercel, Netlify, etc.)
4. **Set up MongoDB Atlas** for production database
5. **Configure CI/CD** for automatic deployments
6. **Add more features** as per roadmap

---

## 📖 Documentation

- See [README.md](./README.md) for detailed overview
- See [WORK_PLAN.md](./WORK_PLAN.md) for development roadmap

---

## ✅ Completed Features

- [x] Backend architecture with WebSockets
- [x] Frontend React app with routing
- [x] User authentication (signup/login)
- [x] Event management and CRUD
- [x] Real-time score updates
- [x] Follow/unfollow system
- [x] Event history timeline
- [x] Responsive mobile-first design
- [x] Professional UI with Tailwind CSS
- [x] Error handling and validation

---

**Happy coding! 🎉**

For questions or issues, check the troubleshooting section or create an issue in the repository.
