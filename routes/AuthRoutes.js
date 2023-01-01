const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController.js');
const loginMiddleware = require("../middlewares/login")

//router.get('/signup', loginMiddleware.isLoggedin, AuthController.signup)
router.post('/signup', AuthController.signup)
router.post('/log', AuthController.login)

module.exports = router;
