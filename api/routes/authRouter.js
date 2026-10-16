const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post('/login', authController.login);

authRouter.get('/get-me', auth, authController.getMe);

module.exports = authRouter;