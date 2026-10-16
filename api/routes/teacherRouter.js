const express = require('express');
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');

const teacherRouter = express.Router();

teacherRouter.get('/get-teachers', auth, teacherController.getTeachers);

teacherRouter.get('/get-teacher/:id', auth, teacherController.getTeacherById);

teacherRouter.get('/get-my-grades/', auth, teacherController.getMyGrades);

module.exports = teacherRouter;
