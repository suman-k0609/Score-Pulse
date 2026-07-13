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
// const syncLiveGamesFromAPI = async () => {
//     try {
//         console.log('🔄 Syncing live games from Basketball API...');

//         // Get live games from API
//         const response = await axios.get(`${API_BASE_URL}games?live=all`, config);
//         const games = response.data.response || [];

//         if (games.length === 0) {
//             console.log('📭 No live games found');
//             return;
//         }

//         console.log(`✅ Found ${games.length} live games`);

//         for (const game of games) {
//             try {
//                 const eventName = `${game.teams.home.name} vs ${game.teams.away.name}`;
                
//                 // Check if event already exists
//                 let event = await Event.findOne({
//                     eventName: eventName,
//                     sport: 'basketball'
//                 });

//                 if (!event) {
//                     // Create new event
//                     event = new Event({
//                         eventName: eventName,
//                         sport: 'basketball',
//                         team1: {
//                             name: game.teams.home.name,
//                             score: game.scores.home?.total || game.scores.home || 0
//                         },
//                         team2: {
//                             name: game.teams.away.name,
//                             score: game.scores.away?.total || game.scores.away || 0
//                         },
//                         status: 'live',
//                         startTime: new Date(game.date),
//                         venue: game.venue?.name || 'NBA Arena',
//                         description: `${game.league.name} - Season ${game.season}`,
//                         createdBy: new mongoose.Types.ObjectId(),
//                         eventHistory: [
//                             {
//                                 timestamp: new Date(),
//                                 action: 'Match Started',
//                                 team: game.teams.home.name,
//                                 details: `Quarter ${game.periods.current || 1} ongoing`
//                             }
//                         ]
//                     });

//                     await event.save();
//                     console.log(`✅ Created event: ${eventName}`);
//                 } else {
//                     // Update existing event with live scores
//                     const homeScore = game.scores.home?.total || game.scores.home || 0;
//                     const awayScore = game.scores.away?.total || game.scores.away || 0;
//                     const scoreChanged = event.team1.score !== homeScore || event.team2.score !== awayScore;

//                     if (scoreChanged) {
//                         event.team1.score = homeScore;
//                         event.team2.score = awayScore;
//                         event.status = 'live';
//                         event.updatedAt = new Date();

//                         // Add to history if score changed
//                         event.eventHistory.push({
//                             timestamp: new Date(),
//                             action: 'Score Update',
//                             team: homeScore > awayScore ? game.teams.home.name : game.teams.away.name,
//                             details: `${homeScore} - ${awayScore} (Quarter ${game.periods.current || 1})`
//                         });

//                         await event.save();
//                         console.log(`📊 Updated: ${eventName} - Score: ${homeScore} vs ${awayScore}`);
//                     }
//                 }
//             } catch (error) {
//                 console.error(`❌ Error processing game:`, error.message);
//             }
//         }

//         console.log('✅ Sync completed!');
//     } catch (error) {
//         console.error('❌ Error syncing live games:', error.message);
//     }
// };
// Function to sync live games from API to MongoDB
const syncLiveGamesFromAPI = async () => {
    try {
        console.log("🔄 Syncing live games from Basketball API...");

        const response = await axios.get(
            `${API_BASE_URL}games?live=all`,
            config
        );

        const games = response.data.response || [];

        if (games.length === 0) {
            console.log("📭 No live games found");
            return;
        }

        console.log(`✅ Found ${games.length} live games`);

        for (const game of games) {
            try {

                const eventName = `${game.teams.home.name} vs ${game.teams.away.name}`;

                // Find by API Game ID (better than event name)
                let event = await Event.findOne({
                    apiGameId: game.id,
                    sport: "basketball"
                });

                const homeScore = game.scores.home?.total || game.scores.home || 0;
                const awayScore = game.scores.away?.total || game.scores.away || 0;

                if (!event) {

                    event = new Event({
                        apiGameId: game.id,
                        eventName,
                        sport: "basketball",

                        team1: {
                            name: game.teams.home.name,
                            score: homeScore
                        },

                        team2: {
                            name: game.teams.away.name,
                            score: awayScore
                        },

                        status: "live",

                        startTime: new Date(game.date),

                        venue: game.arena?.name || game.venue?.name || "NBA Arena",

                        description: `${game.league.name} - ${game.season}`,

                        createdBy: new mongoose.Types.ObjectId(),

                        eventHistory: [
                            {
                                timestamp: new Date(),
                                action: "Match Started",
                                team: game.teams.home.name,
                                details: `Quarter ${game.periods?.current || 1}`
                            }
                        ]
                    });

                    await event.save();

                    console.log(`✅ Created ${eventName}`);

                } else {

                    event.team1.score = homeScore;
                    event.team2.score = awayScore;
                    event.status = "live";
                    event.updatedAt = new Date();

                    event.eventHistory.push({
                        timestamp: new Date(),
                        action: "Score Update",
                        team: homeScore >= awayScore
                            ? game.teams.home.name
                            : game.teams.away.name,
                        details: `${homeScore}-${awayScore} | Quarter ${game.periods?.current || 1}`
                    });

                    await event.save();

                    console.log(`📊 Updated ${eventName} : ${homeScore}-${awayScore}`);
                }

            } catch (err) {
                console.error("❌ Error processing game:", err.message);
            }
        }

        console.log("✅ Live Sync Completed");

    } catch (err) {
        console.error("❌ Live Sync Error:", err.message);
    }
};
// // Function to sync upcoming and completed games from API to MongoDB
// const syncUpcomingGamesFromAPI = async () => {
//     try {
//         console.log('📅 Syncing upcoming and completed games from Basketball API...');

//         // Popular NBA teams to fetch games for
//         const teams = [161, 162, 163, 164, 165, 166, 167, 168, 169, 170];
//         const allGames = [];
//         const gameIds = new Set(); // To avoid duplicates

//         // Fetch games from multiple seasons and teams
//         // const seasons = [2023, 2022, 2021];
//         const currentSeason = new Date().getFullYear() - 1;
// const seasons = [currentSeason];

//         for (const season of seasons) {
//             for (const teamId of teams) {
//                 try {
//                     const response = await axios.get(`${API_BASE_URL}games?season=${season}&team=${teamId}`, config);
//                     const games = response.data.response || [];
                    
//                     // Only add unique games (by game ID)
//                     for (const game of games) {
//                         if (!gameIds.has(game.id)) {
//                             gameIds.add(game.id);
//                             allGames.push(game);
//                         }
//                     }
                    
//                     if (games.length > 0) {
//                         console.log(`✅ Fetched ${games.length} games for team ${teamId}, season ${season}`);
//                     }
//                 } catch (error) {
//                     // Silent fail for rate limiting
//                 }
//             }
//         }

//         if (allGames.length === 0) {
//             console.log('📭 No games found');
//             return;
//         }

//         console.log(`✅ Total unique games fetched: ${allGames.length}`);

//         for (const game of allGames) {
//             try {
//                 const eventName = `${game.teams.home.name} vs ${game.teams.away.name}`;
//                 const gameDate = new Date(game.date);
//                 const now = new Date();
                
//                 // Determine status
//                 let eventStatus = 'upcoming';
//                 if (game.status === 'Finished') {
//                     eventStatus = 'completed';
//                 } else if (game.status === 'Live') {
//                     eventStatus = 'live';
//                 } else if (gameDate < now) {
//                     eventStatus = 'completed';
//                 } else if (gameDate > now) {
//                     eventStatus = 'upcoming';
//                 }
                
//                 // Check if event already exists by game API ID to avoid duplicates
//                 let event = await Event.findOne({
//                     'apiGameId': game.id,
//                     sport: 'basketball'
//                 });

//                 if (!event) {
//                     // Create new event
//                     const eventHistory = [];
                    
//                     // If game is completed, add final score to history
//                     if (eventStatus === 'completed') {
//                         eventHistory.push({
//                             timestamp: gameDate,
//                             action: 'Match Started',
//                             team: game.teams.home.name,
//                             details: 'Match began'
//                         });
//                         eventHistory.push({
//                             timestamp: new Date(gameDate.getTime() + 3600000), // 1 hour later
//                             action: 'Match Completed',
//                             team: game.scores.home > game.scores.away ? game.teams.home.name : game.teams.away.name,
//                             details: `Final Score: ${game.scores.home} - ${game.scores.away}`
//                         });
//                     }

//                     event = new Event({
//                         apiGameId: game.id,
//                         eventName: eventName,
//                         sport: 'basketball',
//                         team1: {
//                             name: game.teams.home.name,
//                             score: game.scores.home?.total || 0
//                         },
//                         team2: {
//                             name: game.teams.away.name,
//                             score: game.scores.away?.total || 0
//                         },
//                         status: eventStatus,
//                         startTime: gameDate,
//                         venue: game.venue?.name || 'NBA Arena',
//                         description: `${game.league.name} - Season ${game.season}`,
//                         createdBy: new mongoose.Types.ObjectId(),
//                         eventHistory: eventHistory
//                     });

//                     await event.save();
//                     console.log(`✅ Created ${eventStatus} event: ${eventName}`);
//                 } else {
//                     // Update existing event if status or scores changed
//                     const homeScore = game.scores.home?.total || game.scores.home || 0;
//                     const awayScore = game.scores.away?.total || game.scores.away || 0;
                    
//                     if (event.status !== eventStatus || event.team1.score !== homeScore || event.team2.score !== awayScore) {
//                         event.team1.score = homeScore;
//                         event.team2.score = awayScore;
//                         event.status = eventStatus;
//                         await event.save();
//                         console.log(`📊 Updated event: ${eventName} - Status: ${eventStatus}, Score: ${homeScore}-${awayScore}`);
//                     }
//                 }
//             } catch (error) {
//                 console.error(`❌ Error processing game:`, error.message);
//             }
//         }

//         console.log('✅ Games sync completed!');
//     } catch (error) {
//         console.error('❌ Error syncing games:', error.message);
//     }
// };

// Function to sync upcoming and completed games from API to MongoDB
const syncUpcomingGamesFromAPI = async () => {
    try {
        console.log("📅 Syncing upcoming and completed games...");

        // Remove old basketball events
        await Event.deleteMany({ sport: "basketball" });

        // NBA Team IDs
        const teams = [161, 162, 163, 164, 165, 166, 167, 168, 169, 170];

        const allGames = [];
        const gameIds = new Set();

        // Current API season
        const currentSeason = 2025;

        for (const teamId of teams) {
            try {

                const response = await axios.get(
                    `${API_BASE_URL}games?season=${currentSeason}&team=${teamId}`,
                    config
                );

                const games = response.data.response || [];

                for (const game of games) {

                    if (!gameIds.has(game.id)) {
                        gameIds.add(game.id);
                        allGames.push(game);
                    }

                }

                console.log(
                    `✅ Team ${teamId}: ${games.length} games`
                );

            } catch (err) {
                console.log(`⚠️ Team ${teamId} skipped`);
            }
        }

        console.log(`✅ Total Games: ${allGames.length}`);

        const now = new Date();

        for (const game of allGames) {

            const gameDate = new Date(game.date);

            let status = "upcoming";

            if (game.status?.long === "Finished") {
                status = "completed";
            }
            else if (
                game.status?.short === "Q1" ||
                game.status?.short === "Q2" ||
                game.status?.short === "Q3" ||
                game.status?.short === "Q4" ||
                game.status?.short === "HT" ||
                game.status?.short === "OT"
            ) {
                status = "live";
            }
            else if (gameDate < now) {
                status = "completed";
            }

            const homeScore =
                game.scores.home?.total ||
                game.scores.home ||
                0;

            const awayScore =
                game.scores.away?.total ||
                game.scores.away ||
                0;

            await Event.findOneAndUpdate(

                {
                    apiGameId: game.id
                },

                {

                    apiGameId: game.id,

                    eventName:
                        `${game.teams.home.name} vs ${game.teams.away.name}`,

                    sport: "basketball",

                    team1: {
                        name: game.teams.home.name,
                        score: homeScore
                    },

                    team2: {
                        name: game.teams.away.name,
                        score: awayScore
                    },

                    status,

                    startTime: gameDate,

                    venue:
                        game.arena?.name ||
                        game.venue?.name ||
                        "NBA Arena",

                    description:
                        `${game.league.name} - Season ${game.season}`,

                    createdBy: new mongoose.Types.ObjectId()

                },

                {
                    upsert: true,
                    new: true
                }

            );

        }

        console.log("✅ Upcoming Sync Completed");

    } catch (err) {

        console.error("❌ Upcoming Sync Error:", err.message);

    }
};

// Start auto-sync on server startup
// const startLiveSync = () => {
//     console.log('🚀 Starting live game sync service...');

//     // Try to sync live games to catch real-time updates
//     syncLiveGamesFromAPI();

//     // Then sync live games every 30 seconds for live updates
//     syncInterval = setInterval(() => {
//         syncLiveGamesFromAPI();
//     }, 30000); // 30 seconds

//     console.log('✅ Live sync service started (live updates every 30 seconds)');
//     console.log('📝 Note: Using seeded game data. Run "node seedRealGames.js" to refresh data.');
// };

// const startLiveSync = async () => {
//     console.log("🚀 Starting live sync...");

//     // Remove old basketball events
//     await Event.deleteMany({ sport: "basketball" });

//     // Fetch latest upcoming/completed games
//     await syncUpcomingGamesFromAPI();

//     // Fetch live games
//     await syncLiveGamesFromAPI();

//     // Live updates every 30 seconds
//     syncInterval = setInterval(syncLiveGamesFromAPI, 30000);

//     // Refresh schedule every hour
//     setInterval(syncUpcomingGamesFromAPI, 60 * 60 * 1000);

//     console.log("✅ Live sync started");
// };

// // Stop sync
// const stopLiveSync = () => {
//     if (syncInterval) {
//         clearInterval(syncInterval);
//         console.log('⏹️ Live sync service stopped');
//     }
// };

// module.exports = {
//     startLiveSync,
//     stopLiveSync,
//     syncLiveGamesFromAPI,
//     syncUpcomingGamesFromAPI
// };

// Start auto-sync on server startup
const startLiveSync = async () => {
    console.log("🚀 Starting Live Sync Service...");

    try {

        // Clear previous basketball events
        await Event.deleteMany({ sport: "basketball" });
        console.log("🗑️ Old basketball events removed");

        // Load latest upcoming/completed matches
        await syncUpcomingGamesFromAPI();

        // Load current live matches
        await syncLiveGamesFromAPI();

        // Update live scores every 30 seconds
        syncInterval = setInterval(async () => {
            try {
                await syncLiveGamesFromAPI();
            } catch (err) {
                console.error("❌ Live Sync Interval Error:", err.message);
            }
        }, 30000);

        // Refresh fixtures every hour
        setInterval(async () => {
            try {
                console.log("🔄 Refreshing schedule...");
                await syncUpcomingGamesFromAPI();
            } catch (err) {
                console.error("❌ Schedule Refresh Error:", err.message);
            }
        }, 60 * 60 * 1000);

        console.log("✅ Live Sync Service Started");
        console.log("⚡ Live scores refresh every 30 seconds");
        console.log("📅 Schedule refreshes every hour");

    } catch (err) {

        console.error("❌ Failed to start Live Sync:", err.message);

    }
};

// Stop sync service
const stopLiveSync = () => {

    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
        console.log("⏹️ Live Sync Service Stopped");
    }

};

module.exports = {
    startLiveSync,
    stopLiveSync,
    syncLiveGamesFromAPI,
    syncUpcomingGamesFromAPI
};
