const express = require('express');
const gradeController = require('../controllers/gradeController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const gradeRouter = express.Router();

gradeRouter.get('/get-grades', auth, gradeController.getGrades);

gradeRouter.get('/get-grade/:id', auth, gradeController.getGradeById);

gradeRouter.post('/create-grade', auth, authorize('Teacher'), gradeController.createGrade);

gradeRouter.put('/update-grade/:id', auth, authorize('Teacher'), gradeController.updateGrade);

gradeRouter.delete('/delete-grade/:id', auth, authorize('Teacher'), gradeController.deleteGrade);

module.exports = gradeRouter;