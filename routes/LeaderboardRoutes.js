const express = require('express');
const router = express.Router();
const loginMiddleware = require("../middlewares/login")
const LeaderboardController = require('../controllers/LeaderboardController')

router.get('/leaderboard', loginMiddleware.isLoggedin, LeaderboardController.leaderboard)

module.exports = router;