const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const adminRouter = express.Router();

// -----Users

adminRouter.post('/create-student', auth, authorize('Admin'), adminController.createStudent);

adminRouter.put('/update-student/:id', auth, authorize('Admin'), adminController.updateStudent);

adminRouter.delete('/delete-student/:id', auth, authorize('Admin'), adminController.deleteStudent);

adminRouter.post('/create-teacher', auth, authorize('Admin'), adminController.createTeacher);

adminRouter.put('/update-teacher/:id', auth, authorize('Admin'), adminController.updateTeacher);

adminRouter.delete('/delete-teacher/:id', auth, authorize('Admin'), adminController.deleteTeacher);

adminRouter.post('/create-admin', auth, authorize('Admin'), adminController.createAdmin);

adminRouter.put('/update-admin/:id', auth, authorize('Admin'), adminController.updateAdmin);

adminRouter.delete('/delete-admin/:id', auth, authorize('Admin'), adminController.deleteAdmin);

adminRouter.get('/list-users', auth, authorize('Admin'), adminController.listUsers);


// -----Schedules

adminRouter.post('/create-schedule', auth, authorize('Admin'), adminController.createSchedule);

adminRouter.put('/update-schedule/:id', auth, authorize('Admin'), adminController.updateSchedule);

adminRouter.delete('/delete-schedule/:id', auth, authorize('Admin'), adminController.deleteSchedule);


// -----Class

adminRouter.post('/create-class', auth, authorize('Admin'), adminController.createClass);

adminRouter.put('/update-class/:id', auth, authorize('Admin'), adminController.updateClass);

adminRouter.delete('/delete-class/:id', auth, authorize('Admin'), adminController.deleteClass);

// -----SchoolSetting

adminRouter.put('/set-current-day', auth, authorize('Admin'), adminController.setCurrentDay);

// -----Subject

adminRouter.post('/create-subject', auth, authorize('Admin'), adminController.createSubject);

adminRouter.put('/update-subject/:id', auth, authorize('Admin'), adminController.updateSubject);

adminRouter.delete('/delete-subject/:id', auth, authorize('Admin'), adminController.deleteSubject);

module.exports = adminRouter;