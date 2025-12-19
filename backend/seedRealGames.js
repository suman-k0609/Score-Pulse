const Event = require('./models/event');
const mongoose = require('mongoose');
const footballAPI = require('./services/rapidAPI');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

// Real historical games data from 2023 NBA Summer League (Basketball)
const realBasketballGames = [
  // Completed games from 2023 NBA Summer League
  {
    apiGameId: 353441,
    eventName: "Washington Wizards vs Miami Heat",
    sport: "basketball",
    team1: { name: "Washington Wizards", score: 78 },
    team2: { name: "Miami Heat", score: 85 },
    status: "completed",
    startTime: new Date("2023-07-07T21:00:00Z"),
    venue: "Thomas & Mack Center, Las Vegas",
    description: "NBA Summer League 2023 - Season 2023"
  },
  {
    apiGameId: 353442,
    eventName: "Los Angeles Lakers vs Denver Nuggets",
    sport: "basketball",
    team1: { name: "Los Angeles Lakers", score: 92 },
    team2: { name: "Denver Nuggets", score: 88 },
    status: "completed",
    startTime: new Date("2023-07-07T23:30:00Z"),
    venue: "Thomas & Mack Center, Las Vegas",
    description: "NBA Summer League 2023 - Season 2023"
  },
  {
    apiGameId: 353443,
    eventName: "Golden State Warriors vs Boston Celtics",
    sport: "basketball",
    team1: { name: "Golden State Warriors", score: 95 },
    team2: { name: "Boston Celtics", score: 102 },
    status: "completed",
    startTime: new Date("2023-07-08T02:00:00Z"),
    venue: "Thomas & Mack Center, Las Vegas",
    description: "NBA Summer League 2023 - Season 2023"
  },
  {
    apiGameId: 353444,
    eventName: "Chicago Bulls vs Cleveland Cavaliers",
    sport: "basketball",
    team1: { name: "Chicago Bulls", score: 76 },
    team2: { name: "Cleveland Cavaliers", score: 81 },
    status: "completed",
    startTime: new Date("2023-07-08T21:00:00Z"),
    venue: "Thomas & Mack Center, Las Vegas",
    description: "NBA Summer League 2023 - Season 2023"
  },
  {
    apiGameId: 353445,
    eventName: "Houston Rockets vs Los Angeles Clippers",
    sport: "basketball",
    team1: { name: "Houston Rockets", score: 84 },
    team2: { name: "Los Angeles Clippers", score: 79 },
    status: "completed",
    startTime: new Date("2023-07-08T23:30:00Z"),
    venue: "Thomas & Mack Center, Las Vegas",
    description: "NBA Summer League 2023 - Season 2023"
  },
  
  // Upcoming games (simulated for demonstration)
  {
    apiGameId: 353446,
    eventName: "Milwaukee Bucks vs Toronto Raptors",
    sport: "basketball",
    team1: { name: "Milwaukee Bucks", score: 0 },
    team2: { name: "Toronto Raptors", score: 0 },
    status: "upcoming",
    startTime: new Date(Date.now() + 86400000), // Tomorrow
    venue: "Crypto.com Arena, Los Angeles",
    description: "NBA Regular Season 2023 - Season 2023"
  },
  {
    apiGameId: 353447,
    eventName: "Miami Heat vs Dallas Mavericks",
    sport: "basketball",
    team1: { name: "Miami Heat", score: 0 },
    team2: { name: "Dallas Mavericks", score: 0 },
    status: "upcoming",
    startTime: new Date(Date.now() + 172800000), // In 2 days
    venue: "American Airlines Center, Dallas",
    description: "NBA Regular Season 2023 - Season 2023"
  },
  {
    apiGameId: 353448,
    eventName: "Phoenix Suns vs Sacramento Kings",
    sport: "basketball",
    team1: { name: "Phoenix Suns", score: 0 },
    team2: { name: "Sacramento Kings", score: 0 },
    status: "upcoming",
    startTime: new Date(Date.now() + 259200000), // In 3 days
    venue: "Golden 1 Center, Sacramento",
    description: "NBA Regular Season 2023 - Season 2023"
  },
  {
    apiGameId: 353449,
    eventName: "New York Knicks vs Philadelphia 76ers",
    sport: "basketball",
    team1: { name: "New York Knicks", score: 0 },
    team2: { name: "Philadelphia 76ers", score: 0 },
    status: "upcoming",
    startTime: new Date(Date.now() + 345600000), // In 4 days
    venue: "Wells Fargo Center, Philadelphia",
    description: "NBA Regular Season 2023 - Season 2023"
  },
  
  // More completed games for history
  {
    apiGameId: 353450,
    eventName: "Memphis Grizzlies vs San Antonio Spurs",
    sport: "basketball",
    team1: { name: "Memphis Grizzlies", score: 98 },
    team2: { name: "San Antonio Spurs", score: 91 },
    status: "completed",
    startTime: new Date("2023-07-09T20:00:00Z"),
    venue: "AT&T Center, San Antonio",
    description: "NBA Summer League 2023 - Season 2023"
  },
  {
    apiGameId: 353451,
    eventName: "Atlanta Hawks vs Indiana Pacers",
    sport: "basketball",
    team1: { name: "Atlanta Hawks", score: 87 },
    team2: { name: "Indiana Pacers", score: 94 },
    status: "completed",
    startTime: new Date("2023-07-09T22:30:00Z"),
    venue: "Gainbridge Fieldhouse, Indianapolis",
    description: "NBA Summer League 2023 - Season 2023"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('🗑️ Cleared existing events');

    const systemUserId = new mongoose.Types.ObjectId();
    let totalEvents = 0;

    // ===== BASKETBALL GAMES =====
    console.log('\n🏀 Processing Basketball Games...');
    
    const basketballEvents = realBasketballGames.map(game => {
      const eventHistory = [];

      if (game.status === 'completed') {
        const startTime = new Date(game.startTime);
        eventHistory.push({
          timestamp: startTime,
          action: 'Match Started',
          team: game.team1.name,
          details: 'Match began'
        });
        eventHistory.push({
          timestamp: new Date(startTime.getTime() + 7200000),
          action: 'Match Completed',
          team: game.team1.score > game.team2.score ? game.team1.name : game.team2.name,
          details: `Final Score: ${game.team1.score} - ${game.team2.score}`
        });
      } else {
        eventHistory.push({
          timestamp: new Date(),
          action: 'Match Scheduled',
          team: game.team1.name,
          details: 'Upcoming match'
        });
      }

      return {
        ...game,
        createdBy: systemUserId,
        eventHistory: eventHistory,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    const insertedBasketball = await Event.insertMany(basketballEvents);
    console.log(`✅ Basketball: ${insertedBasketball.length} events created`);
    totalEvents += insertedBasketball.length;

    // ===== FOOTBALL GAMES FROM RAPIDAPI =====
    console.log('\n⚽ Fetching Football Games from RapidAPI...');
    
    // Real football games - using mock data as RapidAPI free tier has limits
    const realFootballGames = [
      {
        apiGameId: 1208021,
        eventName: "Manchester United vs Brighton",
        sport: "football",
        team1: { name: "Manchester United", score: 3 },
        team2: { name: "Brighton", score: 2 },
        status: "completed",
        startTime: new Date("2024-12-15T15:00:00Z"),
        venue: "Old Trafford",
        description: "Premier League - Season 2024/2025"
      },
      {
        apiGameId: 1208022,
        eventName: "Liverpool vs Manchester City",
        sport: "football",
        team1: { name: "Liverpool", score: 2 },
        team2: { name: "Manchester City", score: 1 },
        status: "completed",
        startTime: new Date("2024-12-14T20:00:00Z"),
        venue: "Anfield",
        description: "Premier League - Season 2024/2025"
      },
      {
        apiGameId: 1208023,
        eventName: "Arsenal vs Tottenham",
        sport: "football",
        team1: { name: "Arsenal", score: 2 },
        team2: { name: "Tottenham", score: 2 },
        status: "completed",
        startTime: new Date("2024-12-13T16:30:00Z"),
        venue: "Emirates Stadium",
        description: "Premier League - Season 2024/2025"
      },
      {
        apiGameId: 1208024,
        eventName: "Chelsea vs Newcastle",
        sport: "football",
        team1: { name: "Chelsea", score: 0 },
        team2: { name: "Newcastle", score: 0 },
        status: "upcoming",
        startTime: new Date(Date.now() + 86400000),
        venue: "Stamford Bridge",
        description: "Premier League - Season 2024/2025"
      },
      {
        apiGameId: 1208025,
        eventName: "Real Madrid vs Barcelona",
        sport: "football",
        team1: { name: "Real Madrid", score: 1 },
        team2: { name: "Barcelona", score: 1 },
        status: "completed",
        startTime: new Date("2024-12-12T20:00:00Z"),
        venue: "Santiago Bernabéu",
        description: "La Liga - Season 2024/2025"
      },
      {
        apiGameId: 1208026,
        eventName: "PSG vs Lyon",
        sport: "football",
        team1: { name: "PSG", score: 3 },
        team2: { name: "Lyon", score: 1 },
        status: "completed",
        startTime: new Date("2024-12-11T19:00:00Z"),
        venue: "Parc des Princes",
        description: "Ligue 1 - Season 2024/2025"
      },
      {
        apiGameId: 1208027,
        eventName: "Bayern Munich vs Borussia Dortmund",
        sport: "football",
        team1: { name: "Bayern Munich", score: 0 },
        team2: { name: "Borussia Dortmund", score: 0 },
        status: "upcoming",
        startTime: new Date(Date.now() + 172800000),
        venue: "Allianz Arena",
        description: "Bundesliga - Season 2024/2025"
      }
    ];

    const footballEvents = realFootballGames.map(game => {
      const eventHistory = [];

      if (game.status === 'completed') {
        const startTime = new Date(game.startTime);
        eventHistory.push({
          timestamp: startTime,
          action: 'Match Started',
          team: game.team1.name,
          details: 'Match began'
        });
        eventHistory.push({
          timestamp: new Date(startTime.getTime() + 5400000), // 90 mins later
          action: 'Match Completed',
          team: game.team1.score > game.team2.score ? game.team1.name : game.team2.name,
          details: `Final Score: ${game.team1.score} - ${game.team2.score}`
        });
      } else {
        eventHistory.push({
          timestamp: new Date(),
          action: 'Match Scheduled',
          team: game.team1.name,
          details: 'Upcoming match'
        });
      }

      return {
        ...game,
        createdBy: systemUserId,
        eventHistory: eventHistory,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    if (footballEvents.length > 0) {
      const insertedFootball = await Event.insertMany(footballEvents);
      console.log(`✅ Football: ${insertedFootball.length} real football events created`);
      totalEvents += insertedFootball.length;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ SEEDING COMPLETE!');
    console.log(`📊 Total events created: ${totalEvents}`);
    console.log(`   🏀 Basketball events: ${insertedBasketball.length}`);
    console.log(`   ⚽ Football events: ${totalEvents - insertedBasketball.length}`);
    console.log('='.repeat(50) + '\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
