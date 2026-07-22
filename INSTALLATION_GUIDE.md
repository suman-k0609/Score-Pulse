# 🚀 ScorePulse - Setup & Installation Guide

## Step-by-Step Setup

### Prerequisites
- **Node.js**: v16 or higher
- **MongoDB**: Local MongoDB or MongoDB Atlas Cloud instance
- **npm**: v8 or higher

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
npm start
```

### Environment Variables (`backend/.env`)
```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
MONGO_URL=mongodb+srv://user:pass@cluster0.mongodb.net/Sports_Adda?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
MAJOR_SPORTS_KEY=c48f2d903c0bdfcd16940bcfe6702c38
BASKETBALL=https://v1.basketball.api-sports.io/
RAPIDAPI_KEY=02430772f1msha745f4efa53d95ap19f700jsn510b589e4e8c
RAPIDAPI_HOST=api-football-v1.p.rapidapi.com
```

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Environment Variables (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```
