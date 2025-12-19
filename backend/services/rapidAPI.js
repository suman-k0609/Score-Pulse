const axios = require('axios');
require('dotenv').config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

console.log('🔑 RapidAPI Key loaded:', RAPIDAPI_KEY ? '✅ ' + RAPIDAPI_KEY.substring(0, 10) + '...' : '❌');
console.log('🔗 RapidAPI Host:', RAPIDAPI_HOST || '❌ Not set');

const config = {
    headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
        'Content-Type': 'application/json'
    }
};

const footballAPI = {
    // Get live football matches
    getLiveMatches: async () => {
        try {
            const response = await axios.get(
                'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all',
                config
            );
            return response.data.response || [];
        } catch (error) {
            console.error('Error fetching live matches:', error.message);
            return [];
        }
    },

    // Get today's matches
    getTodayMatches: async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await axios.get(
                `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${today}`,
                config
            );
            return response.data.response || [];
        } catch (error) {
            console.error('Error fetching today matches:', error.message);
            return [];
        }
    },

    // Get upcoming matches for a league
    getUpcomingMatches: async (leagueId = 39, days = 7) => {
        try {
            const today = new Date();
            const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
            const dateStr = futureDate.toISOString().split('T')[0];
            
            const response = await axios.get(
                `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=2024&from=${today.toISOString().split('T')[0]}&to=${dateStr}`,
                config
            );
            return response.data.response || [];
        } catch (error) {
            console.error('Error fetching upcoming matches:', error.message);
            return [];
        }
    },

    // Get finished matches
    getFinishedMatches: async (leagueId = 39, days = 30) => {
        try {
            const today = new Date();
            const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
            
            const response = await axios.get(
                `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=2024&from=${pastDate.toISOString().split('T')[0]}&to=${today.toISOString().split('T')[0]}&status=FT`,
                config
            );
            return response.data.response || [];
        } catch (error) {
            console.error('Error fetching finished matches:', error.message);
            return [];
        }
    },

    // Get league standings
    getStandings: async (leagueId = 39) => {
        try {
            const response = await axios.get(
                `https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=2024`,
                config
            );
            return response.data.response || [];
        } catch (error) {
            console.error('Error fetching standings:', error.message);
            return [];
        }
    },

    // Get match statistics
    getMatchStats: async (fixtureId) => {
        try {
            const response = await axios.get(
                `https://api-football-v1.p.rapidapi.com/v3/statistics?fixture=${fixtureId}`,
                config
            );
            return response.data.response || [];
        } catch (error) {
            console.error('Error fetching match stats:', error.message);
            return [];
        }
    }
};

module.exports = footballAPI;
