const axios = require('axios');
const Event = require('../models/event');
const mongoose = require('mongoose');

const API_BASE_URL = process.env.BASKETBALL;
const API_KEY = process.env.MAJOR_SPORTS_KEY;

const config = {
    headers: {
        'x-apisports-key': API_KEY
    }
};

let syncInterval = null;

// Function to sync live games from API to MongoDB
const syncLiveGamesFromAPI = async () => {
    try {
        console.log('🔄 Syncing live games from Basketball API...');

        // Get live games from API
        const response = await axios.get(`${API_BASE_URL}games?live=all`, config);
        const games = response.data.response || [];

        if (games.length === 0) {
            console.log('📭 No live games found');
            return;
        }

        console.log(`✅ Found ${games.length} live games`);

        for (const game of games) {
            try {
                const eventName = `${game.teams.home.name} vs ${game.teams.away.name}`;
                
                // Check if event already exists
                let event = await Event.findOne({
                    eventName: eventName,
                    sport: 'basketball'
                });

                if (!event) {
                    // Create new event
                    event = new Event({
                        eventName: eventName,
                        sport: 'basketball',
                        team1: {
                            name: game.teams.home.name,
                            score: game.scores.home?.total || game.scores.home || 0
                        },
                        team2: {
                            name: game.teams.away.name,
                            score: game.scores.away?.total || game.scores.away || 0
                        },
                        status: 'live',
                        startTime: new Date(game.date),
                        venue: game.venue?.name || 'NBA Arena',
                        description: `${game.league.name} - Season ${game.season}`,
                        createdBy: new mongoose.Types.ObjectId(),
                        eventHistory: [
                            {
                                timestamp: new Date(),
                                action: 'Match Started',
                                team: game.teams.home.name,
                                details: `Quarter ${game.periods.current || 1} ongoing`
                            }
                        ]
                    });

                    await event.save();
                    console.log(`✅ Created event: ${eventName}`);
                } else {
                    // Update existing event with live scores
                    const homeScore = game.scores.home?.total || game.scores.home || 0;
                    const awayScore = game.scores.away?.total || game.scores.away || 0;
                    const scoreChanged = event.team1.score !== homeScore || event.team2.score !== awayScore;

                    if (scoreChanged) {
                        event.team1.score = homeScore;
                        event.team2.score = awayScore;
                        event.status = 'live';
                        event.updatedAt = new Date();

                        // Add to history if score changed
                        event.eventHistory.push({
                            timestamp: new Date(),
                            action: 'Score Update',
                            team: homeScore > awayScore ? game.teams.home.name : game.teams.away.name,
                            details: `${homeScore} - ${awayScore} (Quarter ${game.periods.current || 1})`
                        });

                        await event.save();
                        console.log(`📊 Updated: ${eventName} - Score: ${homeScore} vs ${awayScore}`);
                    }
                }
            } catch (error) {
                console.error(`❌ Error processing game:`, error.message);
            }
        }

        console.log('✅ Sync completed!');
    } catch (error) {
        console.error('❌ Error syncing live games:', error.message);
    }
};

// Function to sync upcoming and completed games from API to MongoDB
const syncUpcomingGamesFromAPI = async () => {
    try {
        console.log('📅 Syncing upcoming and completed games from Basketball API...');

        // Popular NBA teams to fetch games for
        const teams = [161, 162, 163, 164, 165, 166, 167, 168, 169, 170];
        const allGames = [];
        const gameIds = new Set(); // To avoid duplicates

        // Fetch games from multiple seasons and teams
        const seasons = [2023, 2022, 2021];

        for (const season of seasons) {
            for (const teamId of teams) {
                try {
                    const response = await axios.get(`${API_BASE_URL}games?season=${season}&team=${teamId}`, config);
                    const games = response.data.response || [];
                    
                    // Only add unique games (by game ID)
                    for (const game of games) {
                        if (!gameIds.has(game.id)) {
                            gameIds.add(game.id);
                            allGames.push(game);
                        }
                    }
                    
                    if (games.length > 0) {
                        console.log(`✅ Fetched ${games.length} games for team ${teamId}, season ${season}`);
                    }
                } catch (error) {
                    // Silent fail for rate limiting
                }
            }
        }

        if (allGames.length === 0) {
            console.log('📭 No games found');
            return;
        }

        console.log(`✅ Total unique games fetched: ${allGames.length}`);

        for (const game of allGames) {
            try {
                const eventName = `${game.teams.home.name} vs ${game.teams.away.name}`;
                const gameDate = new Date(game.date);
                const now = new Date();
                
                // Determine status
                let eventStatus = 'upcoming';
                if (game.status === 'Finished') {
                    eventStatus = 'completed';
                } else if (game.status === 'Live') {
                    eventStatus = 'live';
                } else if (gameDate < now) {
                    eventStatus = 'completed';
                } else if (gameDate > now) {
                    eventStatus = 'upcoming';
                }
                
                // Check if event already exists by game API ID to avoid duplicates
                let event = await Event.findOne({
                    'apiGameId': game.id,
                    sport: 'basketball'
                });

                if (!event) {
                    // Create new event
                    const eventHistory = [];
                    
                    // If game is completed, add final score to history
                    if (eventStatus === 'completed') {
                        eventHistory.push({
                            timestamp: gameDate,
                            action: 'Match Started',
                            team: game.teams.home.name,
                            details: 'Match began'
                        });
                        eventHistory.push({
                            timestamp: new Date(gameDate.getTime() + 3600000), // 1 hour later
                            action: 'Match Completed',
                            team: game.scores.home > game.scores.away ? game.teams.home.name : game.teams.away.name,
                            details: `Final Score: ${game.scores.home} - ${game.scores.away}`
                        });
                    }

                    event = new Event({
                        apiGameId: game.id,
                        eventName: eventName,
                        sport: 'basketball',
                        team1: {
                            name: game.teams.home.name,
                            score: game.scores.home?.total || 0
                        },
                        team2: {
                            name: game.teams.away.name,
                            score: game.scores.away?.total || 0
                        },
                        status: eventStatus,
                        startTime: gameDate,
                        venue: game.venue?.name || 'NBA Arena',
                        description: `${game.league.name} - Season ${game.season}`,
                        createdBy: new mongoose.Types.ObjectId(),
                        eventHistory: eventHistory
                    });

                    await event.save();
                    console.log(`✅ Created ${eventStatus} event: ${eventName}`);
                } else {
                    // Update existing event if status or scores changed
                    const homeScore = game.scores.home?.total || game.scores.home || 0;
                    const awayScore = game.scores.away?.total || game.scores.away || 0;
                    
                    if (event.status !== eventStatus || event.team1.score !== homeScore || event.team2.score !== awayScore) {
                        event.team1.score = homeScore;
                        event.team2.score = awayScore;
                        event.status = eventStatus;
                        await event.save();
                        console.log(`📊 Updated event: ${eventName} - Status: ${eventStatus}, Score: ${homeScore}-${awayScore}`);
                    }
                }
            } catch (error) {
                console.error(`❌ Error processing game:`, error.message);
            }
        }

        console.log('✅ Games sync completed!');
    } catch (error) {
        console.error('❌ Error syncing games:', error.message);
    }
};

// Start auto-sync on server startup
const startLiveSync = () => {
    console.log('🚀 Starting live game sync service...');

    // Try to sync live games to catch real-time updates
    syncLiveGamesFromAPI();

    // Then sync live games every 30 seconds for live updates
    syncInterval = setInterval(() => {
        syncLiveGamesFromAPI();
    }, 30000); // 30 seconds

    console.log('✅ Live sync service started (live updates every 30 seconds)');
    console.log('📝 Note: Using seeded game data. Run "node seedRealGames.js" to refresh data.');
};

// Stop sync
const stopLiveSync = () => {
    if (syncInterval) {
        clearInterval(syncInterval);
        console.log('⏹️ Live sync service stopped');
    }
};

module.exports = {
    startLiveSync,
    stopLiveSync,
    syncLiveGamesFromAPI,
    syncUpcomingGamesFromAPI
};
