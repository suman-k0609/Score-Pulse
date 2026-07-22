const dns = require("dns");
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const axios = require("axios");
const mongoose = require("mongoose");
const Event = require("../models/event");

const BASKETBALL_API = process.env.BASKETBALL || "https://v1.basketball.api-sports.io/";
const BASKETBALL_KEY = process.env.MAJOR_SPORTS_KEY;

const FOOTBALL_API = "https://api-football-v1.p.rapidapi.com/v3/";
const FOOTBALL_KEY = process.env.RAPIDAPI_KEY;
const FOOTBALL_HOST = process.env.RAPIDAPI_HOST;

const footballConfig = {
    headers: {
        "x-rapidapi-key": FOOTBALL_KEY,
        "x-rapidapi-host": FOOTBALL_HOST
    }
};

const basketballConfig = {
    headers: {
        "x-apisports-key": BASKETBALL_KEY
    }
};

// Universal Match Status Evaluator
function getMatchStatus(startTimeDate, apiStatusShort = '', sport = 'football') {
    const now = new Date();
    const startTime = new Date(startTimeDate);

    if (isNaN(startTime.getTime())) return 'upcoming';

    const shortUpper = String(apiStatusShort || '').toUpperCase();

    // 1. Explicit API FT / Finished
    if (['FT', 'AET', 'PEN', 'POST', 'FINISHED', 'COMPLETED', 'POSTP'].includes(shortUpper)) {
        return 'completed';
    }

    // 2. Explicit API Live
    if (['1H', '2H', 'HT', 'ET', 'P', 'LIVE', 'IN', 'Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT'].includes(shortUpper)) {
        return 'live';
    }

    // 3. Time-based calculation relative to current time
    const timeDiffMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);

    const durations = {
        football: 120,
        basketball: 130,
        tennis: 150,
        cricket: 240
    };
    const maxDuration = durations[sport] || 130;

    if (timeDiffMinutes < 0) {
        // Start time is in the future
        return 'upcoming';
    } else if (timeDiffMinutes >= 0 && timeDiffMinutes <= maxDuration) {
        // Started within max duration -> LIVE
        return 'live';
    } else {
        // Started over max duration ago -> COMPLETED
        return 'completed';
    }
}

// 1. REAL FOOTBALL SYNC FROM RAPIDAPI
async function syncFootballFromRapidAPI() {
    try {
        console.log("⚽ Fetching Real Football Matches from RapidAPI...");
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`${FOOTBALL_API}fixtures?date=${today}`, footballConfig);
        const fixtures = response.data.response || [];

        console.log(`⚽ RapidAPI returned ${fixtures.length} real football fixtures for ${today}`);

        const systemUserId = new mongoose.Types.ObjectId();
        const bulkOps = [];

        for (const m of fixtures.slice(0, 50)) {
            try {
                const shortStatus = m.fixture?.status?.short || '';
                const startTime = new Date(m.fixture.date);
                const computedStatus = getMatchStatus(startTime, shortStatus, 'football');

                const homeScore = typeof m.goals?.home === 'number' ? m.goals.home : 0;
                const awayScore = typeof m.goals?.away === 'number' ? m.goals.away : 0;
                const homeName = m.teams?.home?.name || 'Home Team';
                const awayName = m.teams?.away?.name || 'Away Team';

                bulkOps.push({
                    updateOne: {
                        filter: { apiGameId: `rapidapi_football_${m.fixture.id}` },
                        update: {
                            $set: {
                                apiGameId: `rapidapi_football_${m.fixture.id}`,
                                eventName: `${homeName} vs ${awayName}`,
                                sport: "football",
                                team1: { name: homeName, score: homeScore },
                                team2: { name: awayName, score: awayScore },
                                status: computedStatus,
                                startTime: startTime,
                                venue: m.fixture?.venue?.name || "Stadium",
                                description: `${m.league?.name || 'Football League'} | ${m.league?.country || 'Global'}`,
                                createdBy: systemUserId,
                                updatedAt: new Date()
                            }
                        },
                        upsert: true
                    }
                });
            } catch (err) {}
        }

        if (bulkOps.length > 0) {
            await Event.bulkWrite(bulkOps);
        }
        console.log(`✅ Synced ${bulkOps.length} Real Football Matches from RapidAPI!`);
        return bulkOps.length;
    } catch (err) {
        console.log("❌ RapidAPI Football Sync error:", err.message);
        return 0;
    }
}

// 2. REAL BASKETBALL SYNC FROM API-SPORTS
async function syncBasketballFromAPISports() {
    try {
        console.log("🏀 Fetching Real Basketball Games from API-Sports...");
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`${BASKETBALL_API}games?date=${today}`, basketballConfig);
        const games = response.data.response || [];

        console.log(`🏀 API-Sports returned ${games.length} real basketball games for ${today}`);

        const systemUserId = new mongoose.Types.ObjectId();
        const bulkOps = [];

        for (const g of games.slice(0, 30)) {
            try {
                const shortStatus = g.status?.short || '';
                const startTime = new Date(g.date);
                const computedStatus = getMatchStatus(startTime, shortStatus, 'basketball');

                const homeScore = typeof g.scores?.home?.total === 'number' ? g.scores.home.total : 0;
                const awayScore = typeof g.scores?.away?.total === 'number' ? g.scores.away.total : 0;
                const homeName = g.teams?.home?.name || 'Home Team';
                const awayName = g.teams?.away?.name || 'Away Team';

                bulkOps.push({
                    updateOne: {
                        filter: { apiGameId: `apisports_basketball_${g.id}` },
                        update: {
                            $set: {
                                apiGameId: `apisports_basketball_${g.id}`,
                                eventName: `${homeName} vs ${awayName}`,
                                sport: "basketball",
                                team1: { name: homeName, score: homeScore },
                                team2: { name: awayName, score: awayScore },
                                status: computedStatus,
                                startTime: startTime,
                                venue: g.venue || "Basketball Arena",
                                description: `${g.league?.name || 'Basketball League'} (${g.country?.name || 'Global'})`,
                                createdBy: systemUserId,
                                updatedAt: new Date()
                            }
                        },
                        upsert: true
                    }
                });
            } catch (err) {}
        }

        if (bulkOps.length > 0) {
            await Event.bulkWrite(bulkOps);
        }
        console.log(`✅ Synced ${bulkOps.length} Real Basketball Games from API-Sports!`);
        return bulkOps.length;
    } catch (err) {
        console.log("❌ Basketball Sync error:", err.message);
        return 0;
    }
}

// 3. REAL TENNIS SYNC FROM ESPN API
async function syncTennisFromESPN() {
    try {
        console.log("🎾 Fetching Real Tennis Matches from ESPN...");
        const response = await axios.get("https://site.api.espn.com/apis/site/v2/sports/tennis/all/scoreboard");
        const events = response.data.events || [];

        const systemUserId = new mongoose.Types.ObjectId();
        const bulkOps = [];

        for (const ev of events) {
            const groupings = ev.groupings || [];
            for (const g of groupings) {
                const comps = g.competitions || [];
                for (const c of comps.slice(0, 10)) {
                    try {
                        const noteText = c.notes && c.notes[0] ? c.notes[0].text : '';
                        if (!noteText && (!c.competitors || c.competitors.length < 2)) continue;

                        let team1Name = "Player 1";
                        let team2Name = "Player 2";
                        let team1Score = 0;
                        let team2Score = 0;

                        if (c.competitors && c.competitors.length >= 2) {
                            team1Name = c.competitors[0].athlete?.displayName || c.competitors[0].team?.displayName || "";
                            team2Name = c.competitors[1].athlete?.displayName || c.competitors[1].team?.displayName || "";
                            team1Score = parseInt(c.competitors[0].score || 0, 10);
                            team2Score = parseInt(c.competitors[1].score || 0, 10);
                        } else if (noteText) {
                            const parts = noteText.split(/\s+bt\s+|\s+leads\s+|\s+v\s+/i);
                            if (parts.length >= 2) {
                                team1Name = parts[0].trim();
                                team2Name = parts[1].trim();
                            }
                        }

                        // Skip if names are missing or generic placeholders
                        if (!team1Name || !team2Name || team1Name === "Player 1" || team2Name === "Player 2" || team1Name === team2Name) {
                            continue;
                        }

                        const startTime = new Date(c.date || Date.now());
                        const shortState = c.status?.type?.state || '';
                        const computedStatus = getMatchStatus(startTime, shortState, 'tennis');

                        const gameId = c.id || `${g.grouping?.id || 't'}_${Math.random()}`;

                        bulkOps.push({
                            updateOne: {
                                filter: { apiGameId: `espn_tennis_${gameId}` },
                                update: {
                                    $set: {
                                        apiGameId: `espn_tennis_${gameId}`,
                                        eventName: `${team1Name} vs ${team2Name}`,
                                        sport: "tennis",
                                        team1: { name: team1Name, score: team1Score },
                                        team2: { name: team2Name, score: team2Score },
                                        status: computedStatus,
                                        startTime: startTime,
                                        venue: c.venue?.fullName || "Tennis Court",
                                        description: `${g.grouping?.displayName || 'Tennis Tournament'} - ${noteText || 'Live Match'}`,
                                        createdBy: systemUserId,
                                        updatedAt: new Date()
                                    }
                                },
                                upsert: true
                            }
                        });
                    } catch (e) {}
                }
            }
        }

        if (bulkOps.length > 0) {
            await Event.bulkWrite(bulkOps);
        }
        console.log(`✅ Synced ${bulkOps.length} Real Tennis Matches from ESPN!`);
        return bulkOps.length;
    } catch (err) {
        console.log("❌ ESPN Tennis Sync error:", err.message);
        return 0;
    }
}

// 4. REAL CRICKET SYNC FROM ESPNCRICINFO RSS
async function syncCricketFromRSS() {
    try {
        console.log("🏏 Fetching Real Cricket Matches from Cricinfo RSS...");
        const response = await axios.get("https://static.cricinfo.com/rss/livescores.xml");
        const xmlText = response.data || "";
        const items = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

        const systemUserId = new mongoose.Types.ObjectId();
        const bulkOps = [];

        for (const item of items) {
            try {
                const titleMatch = item.match(/<title>(.*?)<\/title>/);
                const guidMatch = item.match(/<guid>(.*?)<\/guid>/);
                if (!titleMatch) continue;

                const rawTitle = titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
                const parts = rawTitle.split(/\s+v\s+|\s+vs\s+/i);
                if (parts.length < 2) continue;

                const team1Raw = parts[0].trim();
                const team2Raw = parts[1].trim();

                const parseTeam = (str) => {
                    const scoreMatch = str.match(/(\d+\/\d+[\d\s\/\&\*]*)/);
                    if (scoreMatch) {
                        const scoreStr = scoreMatch[1].trim();
                        const name = str.replace(scoreMatch[0], '').replace(/\s+\*/, '').replace(/\s+&\s+$/, '').trim();
                        return { name: name || str, scoreStr };
                    }
                    return { name: str.trim(), scoreStr: "0" };
                };

                const t1 = parseTeam(team1Raw);
                const t2 = parseTeam(team2Raw);

                const isLive = rawTitle.includes('*');
                const isScheduled = !rawTitle.includes('/') && !isLive;
                const status = isLive ? 'live' : isScheduled ? 'upcoming' : 'completed';
                const guid = guidMatch ? guidMatch[1] : rawTitle;

                bulkOps.push({
                    updateOne: {
                        filter: { apiGameId: `cricinfo_cricket_${encodeURIComponent(guid)}` },
                        update: {
                            $set: {
                                apiGameId: `cricinfo_cricket_${encodeURIComponent(guid)}`,
                                eventName: `${t1.name} vs ${t2.name}`,
                                sport: "cricket",
                                team1: { name: t1.name, score: t1.scoreStr },
                                team2: { name: t2.name, score: t2.scoreStr },
                                status: status,
                                startTime: new Date(),
                                venue: "International Cricket Stadium",
                                description: `Match Score: ${rawTitle}`,
                                createdBy: systemUserId,
                                updatedAt: new Date()
                            }
                        },
                        upsert: true
                    }
                });
            } catch (e) {}
        }

        if (bulkOps.length > 0) {
            await Event.bulkWrite(bulkOps);
        }
        console.log(`✅ Synced ${bulkOps.length} Real Cricket Matches from Cricinfo!`);
        return bulkOps.length;
    } catch (err) {
        console.log("❌ Cricket Sync error:", err.message);
        return 0;
    }
}

// 5. MASTER ALL REAL DATA SYNC
async function syncAllRealData() {
    console.log("⚡ Starting High-Speed Bulk Real Data Sync Across All 4 Sports...");

    const fb = await syncFootballFromRapidAPI();
    const bb = await syncBasketballFromAPISports();
    const tn = await syncTennisFromESPN();
    const ck = await syncCricketFromRSS();

    console.log(`🎉 HIGH-SPEED REAL DATA SYNC COMPLETE: ${fb} Football, ${bb} Basketball, ${tn} Tennis, ${ck} Cricket matches!`);
}

const startLiveSync = () => {
    console.log("🚀 Multi-Sport Live Sync Engine Initialized");
    
    // Immediate sync on startup
    syncAllRealData();

    // Periodic re-sync every 2 minutes for live updates
    setInterval(() => {
        syncAllRealData();
    }, 120000);
};

module.exports = {
    startLiveSync,
    syncAllRealData,
    syncFootballFromRapidAPI,
    syncBasketballFromAPISports,
    syncTennisFromESPN,
    syncCricketFromRSS,
    getMatchStatus
};