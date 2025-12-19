const axios = require('axios');
const Event = require('../models/event');
const mongoose = require('mongoose');

const API_BASE_URL = 'https://v1.basketball.api-sports.io';
const API_KEY = process.env.MAJOR_SPORTS_KEY;

const config = {
    headers: {
        'x-apisports-key': API_KEY
    }
};

// Fetch live basketball games from API and sync to MongoDB
const syncLiveGames = async (req, res) => {
    try {
        // Get live games from API
        const response = await axios.get(`${API_BASE_URL}/games?live=all`, config);
        const games = response.data.response;

        console.log(`Found ${games.length} live games`);

        // Create or update events in MongoDB
        const createdEvents = [];

        for (const game of games) {
            try {
                // Check if event already exists
                let event = await Event.findOne({
                    eventName: `${game.teams.home.name} vs ${game.teams.away.name}`,
                    sport: 'basketball'
                });

                if (!event) {
                    // Create new event
                    event = new Event({
                        eventName: `${game.teams.home.name} vs ${game.teams.away.name}`,
                        sport: 'basketball',
                        team1: {
                            name: game.teams.home.name,
                            score: game.scores.home
                        },
                        team2: {
                            name: game.teams.away.name,
                            score: game.scores.away
                        },
                        status: 'live',
                        startTime: new Date(game.date),
                        venue: game.venue?.name || 'TBD',
                        description: `Basketball ${game.league.name} - ${game.season} Season`,
                        createdBy: new mongoose.Types.ObjectId(),
                        eventHistory: [
                            {
                                timestamp: new Date(),
                                action: 'Match Started',
                                team: game.teams.home.name,
                                details: `Quarter ${game.periods.current || 1}`
                            }
                        ]
                    });

                    await event.save();
                    createdEvents.push(event);
                } else {
                    // Update existing event with live scores
                    event.team1.score = game.scores.home;
                    event.team2.score = game.scores.away;
                    event.status = 'live';
                    event.updatedAt = new Date();

                    await event.save();
                }
            } catch (error) {
                console.error(`Error processing game ${game.id}:`, error.message);
            }
        }

        res.status(200).json({
            message: `Synced ${createdEvents.length} new live games`,
            events: createdEvents,
            totalLiveGames: games.length
        });
    } catch (error) {
        console.error('Error syncing live games:', error.message);
        res.status(500).json({ error: 'Failed to sync live games from API' });
    }
};

// Get upcoming games from API
const getUpcomingGames = async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/games?live=upcoming`, config);
        const games = response.data.response;

        res.status(200).json({
            message: `Found ${games.length} upcoming games`,
            games: games.slice(0, 10) // Limit to 10
        });
    } catch (error) {
        console.error('Error fetching upcoming games:', error.message);
        res.status(500).json({ error: 'Failed to fetch upcoming games' });
    }
};

// Get game statistics
const getGameStats = async (req, res) => {
    try {
        const { gameId } = req.query;
        const response = await axios.get(`${API_BASE_URL}/games/statistics?id=${gameId}`, config);

        res.status(200).json({
            message: 'Game statistics fetched successfully',
            statistics: response.data.response
        });
    } catch (error) {
        console.error('Error fetching game stats:', error.message);
        res.status(500).json({ error: 'Failed to fetch game statistics' });
    }
};

module.exports = {
    syncLiveGames,
    getUpcomingGames,
    getGameStats
};
