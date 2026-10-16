const { Teacher, Grade, Schedule, User, Subject } = require('../models/index');

exports.getTeachers = async function(req, res) {
    try {
        const where = {};

        if(req.query.subject_id)
            where.subject_id = req.query.subject_id

        const teachers = await Teacher.findAll({
            where,
            include: [
                { model: User, as: 'user', attributes: ['id', 'first_name', 'surname', 'patronymic'] },
                { model: Subject, as: 'subject'}
            ]
        });
        if(!teachers) {
            return res.status(404).json({ message: "Не найдено"});
        }
        res.json(teachers);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getTeacherById = async function(req, res) {
    try {
        const teacher = await Teacher.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'first_name', 'surname', 'patronymic'] },
                { model: Subject, as: 'subject' },
            ]
        });
        if(!teacher) {
            return res.status(404).json({ message: "Не найдено"});
        }
        res.json(teacher);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}


exports.getMyGrades = async function(req, res) {
    try {
        // const where = {};

        const grades = await Grade.findAll({
            include: [{
                model: Schedule,
                as: 'schedule',
                where: { teacher_id: req.user.info.id }
            }]
        });
        res.json(grades);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}