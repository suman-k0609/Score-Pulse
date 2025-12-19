const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Authmiddleware = require('../middleware/auth');

// Add event to favorites
router.post('/favorites/add/:eventId', Authmiddleware, async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: eventId } },
            { new: true }
        );

        res.json({ success: true, message: 'Added to favorites', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove event from favorites
router.post('/favorites/remove/:eventId', Authmiddleware, async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: eventId } },
            { new: true }
        );

        res.json({ success: true, message: 'Removed from favorites', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user favorites
router.get('/favorites', Authmiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('favorites');
        
        res.json({ 
            success: true, 
            favorites: user.favorites || [] 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add favorite team
router.post('/teams/favorite/:team', Authmiddleware, async (req, res) => {
    try {
        const { team } = req.params;
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteTeams: team } },
            { new: true }
        );

        res.json({ success: true, message: 'Favorite team added', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user favorite teams
router.get('/teams/favorites', Authmiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        res.json({ 
            success: true, 
            favoriteTeams: user.favoriteTeams || [] 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
