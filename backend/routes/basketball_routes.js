
const express = require('express');
const router = express.Router();
const { 
    getLeagues, 
    getGames, 
    getGameStatistics 
} = require('../controller/basketballcontroller.js');


router.get('/leagues', getLeagues);


router.get('/games', getGames);


router.get('/statistics', getGameStatistics);

module.exports = router;