const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./routes/user_routes.js');
const basketRoutes = require('./routes/basketball_routes.js');
const eventRoutes = require('./routes/event_routes.js');
const liveRoutes = require('./routes/live_routes.js');
const standingsRoutes = require('./routes/standings_routes.js');
const searchRoutes = require('./routes/search_routes.js');
const preferencesRoutes = require('./routes/preferences_routes.js');
const { startLiveSync } = require('./services/liveSync.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true
    }
});

app.use(express.json()); 

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL; 

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_event', (eventId) => {
        socket.join(`event_${eventId}`);
        console.log(`Client ${socket.id} joined event ${eventId}`);
    });

    socket.on('leave_event', (eventId) => {
        socket.leave(`event_${eventId}`);
        console.log(`Client ${socket.id} left event ${eventId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

mongoose.connect(MONGO_URL)
  .then(() => {
      console.log("Connected to MongoDB");
      
      // Start live game sync service
      startLiveSync();
      
      server.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((err) => {
      console.log("DB Connection Error:", err);
  });

app.use('/api', authRoutes); 
app.use('/api/basketball', basketRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/standings', standingsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/user', preferencesRoutes);

