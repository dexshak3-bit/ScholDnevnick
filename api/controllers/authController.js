const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Student, Teacher } = require('../models/index');

exports.login = async function(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email }});
        const ok = user && await bcrypt.compare(password, user.password_hash);
        if(!ok) {
            return res.status(401).json({ message: 'Неверный логин или пароль' })
        }

        const payload = ({ id: user.id, first_name: user.first_name, surname: user.surname, patronymic: user.patronymic, role: user.role });
        if(user.role === 'Student') {
            const student = await Student.findOne({ where: { user_id: user.id } });
            if(!student)
                return res.status(404).json({ message: "Not found" });
            payload.info = student.toJSON();
        }
        else if(user.role === 'Teacher') {
            const teacher = await Teacher.findOne({ where: { user_id: user.id } });
            if(!teacher)
                return res.status(404).json({ message: "Not found" });
            payload.info = teacher.toJSON();
        } else if (user.role === 'Admin') {
            const admin = user;
            if(!admin)
                return res.status(404).json({ message: "Not found" });
            var {password_hash, ...adminNoHash } = admin.toJSON();
            payload.info = adminNoHash;
        }
        else
            return res.status(400).json({ message: "Error" });

        const userJson = user.toJSON();
        var { password_hash, ...userNoHash } = userJson;
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '25h' });
        res.status(200).json({ token, userNoHash });
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getMe = async function(req, res) {
    try {
        var user = await User.findByPk(req.user.id);
        if(!user)
            return res.status(404).json({ message: "Not found" });

        if(user.role === 'Student') {
            user = await User.findByPk(req.user.id, {
                include: [{ model: Student, as: 'student' }],
            });
        }
        else if(user.role === 'Teacher') {
            user = await User.findByPk(req.user.id, {
                include: [{ model: Teacher, as: 'teacher' }],
            });
        }

        const userJson = user.toJSON();
        var { password_hash, ...userNoHash } = userJson;
        res.json(userNoHash)
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.logout = async function (req, res) {
    try {
        res.status(200).json({ message: 'Успешный выход из системы' });
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}