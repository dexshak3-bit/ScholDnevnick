const express = require('express');
const classroomController = require('../controllers/classroomController');
const auth = require('../middleware/auth');

const classroomRouter = express.Router();

classroomRouter.get('/get-classrooms', auth, classroomController.getClassrooms);

module.exports = classroomRouter;
