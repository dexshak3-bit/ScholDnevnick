const express = require('express');
const classController = require('../controllers/classController');
const auth = require('../middleware/auth');

const classRouter = express.Router();

classRouter.get('/get-classes', auth, classController.getClasses);

module.exports = classRouter;
