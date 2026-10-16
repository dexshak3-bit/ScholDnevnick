const express = require('express');
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

const studentRouter = express.Router();

studentRouter.get('/get-students', auth, studentController.getStudents);

studentRouter.get('/get-student/:id', auth, studentController.getStudentById);

module.exports = studentRouter;
