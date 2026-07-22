const Event = require('../models/event');
const { getMatchStatus } = require('../services/liveSync');

const processBotMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const query = (message || '').toLowerCase().trim();

        if (!query) {
            return res.status(400).json({ reply: "Please ask me a question about live sports, scores, or standings!" });
        }

        const sports = ['football', 'basketball', 'cricket', 'tennis'];
        const matchedSport = sports.find(s => query.includes(s));
        const isLiveQuery = query.includes('live') || query.includes('now') || query.includes('current') || query.includes('score');
        const isStandingsQuery = query.includes('standing') || query.includes('table') || query.includes('rank') || query.includes('leaderboard');

        // A. Standings Query
        if (isStandingsQuery) {
            const sportText = matchedSport ? `for **${matchedSport.toUpperCase()}** ` : '';
            return res.json({
                reply: `🏆 **League Standings Overview ${sportText}:**\n\nScorePulse tracks standings across **Football, Basketball, Tennis & Cricket**! Navigate to the **Standings** tab to see points, wins, and metallic rank badges (🥇 #1, 🥈 #2, 🥉 #3).`
            });
        }

        // B. Sport Query (e.g., "basketball live", "cricket scores", "football matches")
        if (matchedSport) {
            const events = await Event.find({ sport: matchedSport }).sort({ startTime: -1 });

            let targetEvents = events;
            if (isLiveQuery) {
                targetEvents = events.filter(e => getMatchStatus(e.startTime, '', e.sport) === 'live');
            }

            if (targetEvents.length === 0) {
                const statusStr = isLiveQuery ? 'live play' : 'the database';
                return res.json({
                    reply: `⚡ No **${matchedSport.toUpperCase()}** matches in ${statusStr} right now. You can check upcoming or completed games on the dashboard!`
                });
            }

            const list = targetEvents.slice(0, 5).map(e => {
                const statusLabel = getMatchStatus(e.startTime, '', e.sport).toUpperCase();
                const score1 = e.team1.score ?? 0;
                const score2 = e.team2.score ?? 0;
                return `• [${statusLabel}] **${e.team1.name} vs ${e.team2.name}**\n  Score: ${e.team1.name} (${score1}) - ${e.team2.name} (${score2})`;
            }).join('\n\n');

            const headerText = isLiveQuery ? `🔴 **LIVE ${matchedSport.toUpperCase()} MATCHES:**` : `🏆 **TOP ${matchedSport.toUpperCase()} MATCHES:**`;
            return res.json({
                reply: `${headerText}\n\n${list}`
            });
        }

        // C. General Live Query (no specific sport specified)
        if (isLiveQuery) {
            const events = await Event.find({}).sort({ startTime: -1 });
            const liveEvents = events.filter(e => getMatchStatus(e.startTime, '', e.sport) === 'live');

            if (liveEvents.length === 0) {
                return res.json({
                    reply: "⚡ There are currently no matches in live play right now."
                });
            }

            const matchItems = liveEvents.slice(0, 5).map(e => {
                const score1 = e.team1.score ?? 0;
                const score2 = e.team2.score ?? 0;
                return `• **${e.sport.toUpperCase()}**: ${e.team1.name} vs ${e.team2.name} (${score1} - ${score2})`;
            }).join('\n');

            return res.json({
                reply: `🔴 **${liveEvents.length} Matches Currently Live:**\n\n${matchItems}\n\nAsk me for specific sports like *"basketball live"* or *"football live"*!`
            });
        }

        // D. Default Assistant Response
        return res.json({
            reply: `⚡ **ScorePulse AI Assistant**\n\nI can help you track real-time sports updates! Try asking me:\n- *"basketball live"*\n- *"cricket live"*\n- *"football scores"*\n- *"tennis standings"*`
        });

    } catch (error) {
        console.error("Bot Controller Error:", error);
        res.status(500).json({ reply: "Sorry, I had trouble processing your request. Please try again!" });
    }
};

module.exports = { processBotMessage };
