const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController.js');
const loginMiddleware = require("../middlewares/login")

router.get('/signup', loginMiddleware.isLoggedin, AuthController.signup)