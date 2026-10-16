const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

const scheduleRouter = express.Router();

scheduleRouter.get('/get-my-schedule', auth, scheduleController.getSchedules);

scheduleRouter.get('/get-schedule/:id', auth, scheduleController.getScheduleById);

scheduleRouter.get('/get-curr-day', scheduleController.getCurrentDay);




module.exports = scheduleRouter;
