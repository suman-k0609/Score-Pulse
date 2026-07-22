const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const Event = require('./models/event');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

const sampleEvents = [
  // ===== BASKETBALL =====
  {
    apiGameId: "basketball_101",
    eventName: "Los Angeles Lakers vs Golden State Warriors",
    sport: "basketball",
    team1: { name: "Los Angeles Lakers", score: 104 },
    team2: { name: "Golden State Warriors", score: 98 },
    status: "live",
    startTime: new Date(),
    venue: "Crypto.com Arena",
    description: "NBA Live Game 2026"
  },
  {
    apiGameId: "basketball_102",
    eventName: "Boston Celtics vs Miami Heat",
    sport: "basketball",
    team1: { name: "Boston Celtics", score: 88 },
    team2: { name: "Miami Heat", score: 92 },
    status: "completed",
    startTime: new Date(Date.now() - 86400000),
    venue: "TD Garden",
    description: "NBA Regular Season"
  },
  {
    apiGameId: "basketball_103",
    eventName: "Chicago Bulls vs Brooklyn Nets",
    sport: "basketball",
    team1: { name: "Chicago Bulls", score: 0 },
    team2: { name: "Brooklyn Nets", score: 0 },
    status: "upcoming",
    startTime: new Date(Date.now() + 86400000),
    venue: "United Center",
    description: "NBA Upcoming Match"
  },

  // ===== FOOTBALL =====
  {
    apiGameId: "football_201",
    eventName: "Real Madrid vs Barcelona",
    sport: "football",
    team1: { name: "Real Madrid", score: 2 },
    team2: { name: "Barcelona", score: 1 },
    status: "live",
    startTime: new Date(),
    venue: "Santiago Bernabéu",
    description: "El Clásico Live"
  },
  {
    apiGameId: "football_202",
    eventName: "Liverpool vs Manchester City",
    sport: "football",
    team1: { name: "Liverpool", score: 3 },
    team2: { name: "Manchester City", score: 1 },
    status: "completed",
    startTime: new Date(Date.now() - 172800000),
    venue: "Anfield",
    description: "Premier League Derby"
  },
  {
    apiGameId: "football_203",
    eventName: "Arsenal vs Chelsea",
    sport: "football",
    team1: { name: "Arsenal", score: 0 },
    team2: { name: "Chelsea", score: 0 },
    status: "upcoming",
    startTime: new Date(Date.now() + 172800000),
    venue: "Emirates Stadium",
    description: "London Derby Upcoming"
  },

  // ===== CRICKET =====
  {
    apiGameId: "cricket_301",
    eventName: "India vs Australia",
    sport: "cricket",
    team1: { name: "India", score: 285 },
    team2: { name: "Australia", score: 240 },
    status: "live",
    startTime: new Date(),
    venue: "Wankhede Stadium, Mumbai",
    description: "ODI World Series Live"
  },
  {
    apiGameId: "cricket_302",
    eventName: "England vs South Africa",
    sport: "cricket",
    team1: { name: "England", score: 310 },
    team2: { name: "South Africa", score: 312 },
    status: "completed",
    startTime: new Date(Date.now() - 259200000),
    venue: "Lord's, London",
    description: "Test Match Championship"
  },
  {
    apiGameId: "cricket_303",
    eventName: "Pakistan vs New Zealand",
    sport: "cricket",
    team1: { name: "Pakistan", score: 0 },
    team2: { name: "New Zealand", score: 0 },
    status: "upcoming",
    startTime: new Date(Date.now() + 259200000),
    venue: "Gaddafi Stadium, Lahore",
    description: "T20 International Upcoming"
  },

  // ===== TENNIS =====
  {
    apiGameId: "tennis_401",
    eventName: "Carlos Alcaraz vs Jannik Sinner",
    sport: "tennis",
    team1: { name: "Carlos Alcaraz", score: 2 },
    team2: { name: "Jannik Sinner", score: 1 },
    status: "live",
    startTime: new Date(),
    venue: "Roland Garros, Paris",
    description: "Grand Slam Semi-Final Live"
  },
  {
    apiGameId: "tennis_402",
    eventName: "Novak Djokovic vs Rafael Nadal",
    sport: "tennis",
    team1: { name: "Novak Djokovic", score: 3 },
    team2: { name: "Rafael Nadal", score: 2 },
    status: "completed",
    startTime: new Date(Date.now() - 345600000),
    venue: "Wimbledon, London",
    description: "Grand Slam Final"
  },
  {
    apiGameId: "tennis_403",
    eventName: "Daniil Medvedev vs Alexander Zverev",
    sport: "tennis",
    team1: { name: "Daniil Medvedev", score: 0 },
    team2: { name: "Alexander Zverev", score: 0 },
    status: "upcoming",
    startTime: new Date(Date.now() + 345600000),
    venue: "Arthur Ashe Stadium, NY",
    description: "US Open Upcoming"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB');

    await Event.deleteMany({});
    console.log('🗑️ Cleared old events');

    const systemUserId = new mongoose.Types.ObjectId();

    const formattedEvents = sampleEvents.map(game => ({
      ...game,
      createdBy: systemUserId,
      eventHistory: [
        {
          timestamp: new Date(),
          action: game.status === 'live' ? 'Match Live' : game.status === 'completed' ? 'Match Finished' : 'Match Scheduled',
          team: game.team1.name,
          details: `${game.team1.name} vs ${game.team2.name}`
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const inserted = await Event.insertMany(formattedEvents);
    console.log(`✅ SEEDING COMPLETE: Created ${inserted.length} sample events across all sports and statuses!`);

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
    process.exit(1);
  }
};

seedDatabase();
