const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Advanced search
router.get('/', async (req, res) => {
    try {
        const { 
            search = '', 
            sport = '', 
            status = '', 
            sort = '-startTime',
            page = 1,
            limit = 10
        } = req.query;

        let query = {};

        // Text search across event name, teams, venue
        if (search) {
            query.$or = [
                { eventName: { $regex: search, $options: 'i' } },
                { 'team1.name': { $regex: search, $options: 'i' } },
                { 'team2.name': { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by sport
        if (sport) query.sport = sport;

        // Filter by status (upcoming, live, completed)
        if (status) query.status = status;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const events = await Event.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Event.countDocuments(query);

        res.json({
            success: true,
            data: events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unique sports
router.get('/sports/all', async (req, res) => {
    try {
        const sports = await Event.distinct('sport');
        res.json({ success: true, sports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unique teams
router.get('/teams/all', async (req, res) => {
    try {
        const teams = await Event.aggregate([
            {
                $group: {
                    _id: null,
                    teams: { $addToSet: '$team1.name' }
                }
            },
            {
                $project: {
                    _id: 0,
                    teams: 1
                }
            }
        ]);
        
        res.json({ 
            success: true, 
            teams: teams[0]?.teams || [] 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
