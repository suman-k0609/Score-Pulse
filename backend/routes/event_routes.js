const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateScore,
    updateEventStatus,
    addEventHistory,
    followEvent,
    unfollowEvent,
    getUserFollowedEvents,
    isFollowingEvent
} = require('../controller/eventcontroller');

// Public routes
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);

// Protected routes
router.post('/', authMiddleware, createEvent);
router.put('/:eventId/score', authMiddleware, updateScore);
router.put('/:eventId/status', authMiddleware, updateEventStatus);
router.post('/:eventId/history', authMiddleware, addEventHistory);

// Follow/Unfollow routes
router.post('/:eventId/follow', authMiddleware, followEvent);
router.delete('/:eventId/follow', authMiddleware, unfollowEvent);
router.get('/:eventId/is-following', authMiddleware, isFollowingEvent);
router.get('/user/followed-events', authMiddleware, getUserFollowedEvents);

module.exports = router;
