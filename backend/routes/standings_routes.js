const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Get league standings based on events
router.get('/:sport', async (req, res) => {
    try {
        const { sport } = req.params;
        
        // Get all completed events for the sport
        const events = await Event.find({
            sport: sport,
            status: 'completed'
        }).sort({ startTime: -1 });

        // Calculate standings
        const standings = {};

        events.forEach(event => {
            const team1 = event.team1.name;
            const team2 = event.team2.name;
            const score1 = event.team1.score;
            const score2 = event.team2.score;

            // Initialize teams if not exists
            if (!standings[team1]) {
                standings[team1] = { 
                    name: team1, 
                    played: 0, 
                    won: 0, 
                    lost: 0, 
                    drawn: 0,
                    pointsFor: 0,
                    pointsAgainst: 0,
                    points: 0
                };
            }
            if (!standings[team2]) {
                standings[team2] = { 
                    name: team2, 
                    played: 0, 
                    won: 0, 
                    lost: 0, 
                    drawn: 0,
                    pointsFor: 0,
                    pointsAgainst: 0,
                    points: 0
                };
            }

            // Update stats
            standings[team1].played++;
            standings[team2].played++;
            standings[team1].pointsFor += score1;
            standings[team1].pointsAgainst += score2;
            standings[team2].pointsFor += score2;
            standings[team2].pointsAgainst += score1;

            if (score1 > score2) {
                standings[team1].won++;
                standings[team1].points += 3;
                standings[team2].lost++;
            } else if (score2 > score1) {
                standings[team2].won++;
                standings[team2].points += 3;
                standings[team1].lost++;
            } else {
                standings[team1].drawn++;
                standings[team1].points += 1;
                standings[team2].drawn++;
                standings[team2].points += 1;
            }
        });

        // Convert to array and sort by points
        const standingsArray = Object.values(standings)
            .sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
            })
            .map((team, index) => ({
                ...team,
                rank: index + 1,
                goalDifference: team.pointsFor - team.pointsAgainst
            }));

        res.json({
            success: true,
            sport: sport,
            standings: standingsArray,
            updatedAt: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
