const express = require('express');
const router = express.Router();
const { processBotMessage } = require('../controller/botcontroller');

router.post('/chat', processBotMessage);

module.exports = router;
