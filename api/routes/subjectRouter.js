const express = require('express');
const subjectController = require('../controllers/subjectController');
const auth = require('../middleware/auth');

const subjectRouter = express.Router();

subjectRouter.get('/get-subjects', auth, subjectController.getSubjects);

subjectRouter.get('/get-subject/:id', auth, subjectController.getSubjectById);

module.exports = subjectRouter;
