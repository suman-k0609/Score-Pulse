const express = require('express');
const router = express.Router();
const {
    syncLiveGames,
    getUpcomingGames,
    getGameStats
} = require('../controller/livecontroller');

// Sync live games from API to MongoDB
router.post('/sync-live-games', syncLiveGames);

// Get upcoming games from API
router.get('/upcoming-games', getUpcomingGames);

// Get game statistics from API
router.get('/game-stats', getGameStats);

module.exports = router;
