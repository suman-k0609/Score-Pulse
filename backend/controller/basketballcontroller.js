const axios = require('axios');

const API_BASE_URL = process.env.BASKETBALL;
const API_KEY = process.env.MAJOR_SPORTS_KEY;

const config = {
    headers: {
        'x-apisports-key': API_KEY
    }
};

const getLeagues = async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/leagues`, config);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching leagues:', error.message);
        res.status(500).json({ message: 'Server Error fetching leagues' });
    }
};


const getGames = async (req, res) => {
    try {
       
        const response = await axios.get(`${API_BASE_URL}/games`, {
            ...config,
            params: req.query 
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching games:', error.message);
        res.status(500).json({ message: 'Server Error fetching games' });
    }
};


const getGameStatistics = async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/games/statistics`, {
            ...config,
            params: req.query // Requires ?game=ID params
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching stats:', error.message);
        res.status(500).json({ message: 'Server Error fetching statistics' });
    }
};

module.exports = {
    getLeagues,
    getGames,
    getGameStatistics
};