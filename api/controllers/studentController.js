const { where } = require('sequelize');
const { Student, User } = require('../models/index');

exports.getStudents = async function(req, res) {
    try {
        const where = {};
        const isStudent = req.user.role === "Student";

        if(isStudent)
            where.class_id = req.user.info.class_id;
        else if(req.query.class_id)
            where.class_id = req.query.class_id;

        const students = await Student.findAll({
            where,
            attributes: isStudent ? ['id'] : ['id', 'class_id', 'birthday'],
            include: [
                { model: User, as: 'user', attributes: ['id', 'first_name', 'surname', 'patronymic'] },
            ]
        });

        res.json(students);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getStudentById = async function(req, res) {
    try {
        const where = {};
        const isStudent = req.user.role === "Student";
        if(isStudent)
            where.class_id = req.user.info.class_id;
        const student = await Student.findByPk(req.params.id, {
            attributes: isStudent ? ['id', 'class_id'] : ['id', 'class_id', 'birthday'],
            include: [
                { model: User, as: 'user', attributes: ['id', 'first_name', 'surname', 'patronymic'] },
            ],
            where: where
        });
        if(!student) {
            return res.status(404).json({ message: 'Не найдено' });
        }
        res.json(student);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}