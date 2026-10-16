const { User, Student, Schedule, SchoolSetting, Grade } = require('../models/index');


exports.getGradeById = async function(req, res) {
    try {
        const grade = await Grade.findByPk(req.params.id, { 
            include: [
                { model: Student, as: 'student', attributes: {exclude: ['birthday']},
                    include: [
                        { model: User, as: 'user', attributes: ['id', 'first_name', 'surname', 'patronymic'] },
                ]},
        ]});
        if(req.user.role === "Student" && req.user.info.class_id !== grade.student.class_id) {
            return res.status(400).json({ message: 'Ошибка, не твой класс' });
        }
        res.json(grade);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.createGrade = async function(req, res) {
    try {
        const { schedule_id, student_id, value, comment } = req.body;
        const info = { schedule_id, student_id, value, comment };

        const schedule = await Schedule.findByPk(info.schedule_id);
        const student = await Student.findByPk(info.student_id);
        const curr_date = (await SchoolSetting.findOne()).curr_date;

        if (!schedule || !student || !value)
            return res.status(404).json({ message: 'Не заполнено' });
        if (schedule.teacher_id !== req.user.info.id)
            return res.status(400).json({ message: 'Не ваш урок' });
        if (schedule.date > curr_date)
            return res.status(400).json({ message: 'Нельзя оценивать будущее' });
        if (student.class_id !== schedule.class_id)
            return res.status(400).json({ message: 'Студента тут небыло' });
        if(value < 2 || value > 5)
            return res.status(400).json({ message: 'Нет такой оценки' });

        const grade = await Grade.create(info);
        res.json(grade);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getGrades = async function(req, res) {
    try {
        const where = {};
        if(req.user.role === "Student")
            where.student_id = req.user.info.id;

        const grades = await Grade.findAll({
            where,
            include: [
                { model: Schedule, as: 'schedule' },
                { model: Student, as: 'student' },
            ],
            order: [
                ['created_at', 'ASC']
            ]
        });
        res.json(grades);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateGrade = async function(req, res) {
    try {
        const grade = await Grade.findByPk(req.params.id);
        if(!grade)
            return res.status(404).json({ message: 'Не найдено' });
        const { value, comment } = req.body;
        const info = { value, comment };

        const schedule = await Schedule.findByPk(grade.schedule_id);
        if(!schedule)
            return res.status(404).json({ message: 'Не найдено' });
        if(!value)
            return res.status(404).json({ message: 'Не заполнено' });
        if(value < 2 || value > 5)
            return res.status(400).json({ message: 'Нет такой оценки' });
        if (schedule.teacher_id !== req.user.info.id)
            return res.status(400).json({ message: 'Не ваш урок' });

        await grade.update(info);
        grade.save();
        res.json(grade);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.deleteGrade = async function(req, res) {
    try {
        const grade = await Grade.findByPk(req.params.id);
        if(!grade)
            return res.status(404).json({ message: 'Не найдено' });
        const schedule = await Schedule.findByPk(grade.schedule_id);
        if(!schedule)
            return res.status(404).json({ message: 'Не найдено' });
        if (schedule.teacher_id !== req.user.info.id)
            return res.status(400).json({ message: 'Не ваш урок' });
        
        await Grade.destroy({where: {id: req.params.id}});
        res.status(200).json({ message: "Удалено" });
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}