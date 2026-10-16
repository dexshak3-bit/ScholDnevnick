const { Teacher, Schedule, Subject, Classroom, Class, SchoolSetting } = require('../models/index');

exports.getScheduleById = async function(req, res) {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        res.json(schedule);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getSchedules = async function(req, res) {
    try {
        const where = {};
        if(req.user.role === "Student")
            where.class_id = req.user.info.class_id;
        else if(req.user.role === "Teacher")
            where.teacher_id = req.user.info.id;

        if(req.query.date)
            where.date = req.query.date;

        const lessons = await Schedule.findAll({
            where,
            include: [
                { model: Class, as: 'class' },
                { model: Subject, as: 'subject' },
                { model: Teacher, as: 'teacher' },
                { model: Classroom, as: 'classroom' },
            ],
            order: [
                ['date', 'ASC'],
                ['lesson_number', 'ASC'],
            ]
        });
        res.json(lessons);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getCurrentDay = async function(req, res) {
    try {
        const curr = await SchoolSetting.findOne();
        if(!curr)
            return res.status(400).json({ message: "Error" });
        res.json(curr);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}