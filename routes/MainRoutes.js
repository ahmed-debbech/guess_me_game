const express = require('express');
const router = express.Router();
const loginMiddleware = require("../middlewares/login")
const MainController = require('../controllers/MainController')

router.get('/', loginMiddleware.isLoggedin, MainController.root)
router.post('/process', loginMiddleware.isLoggedin, MainController.process)

module.exports = router;