const bcrypt = require('bcryptjs');
const { User, Student, Teacher, Schedule, Subject, Classroom, Class, SchoolSetting, sequelize } = require('../models/index');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-zА-Яа-яЁё]{2,30}$/;

// -----Users




function isAgeValid(birthdayStr, minAge, maxAge) {
    const today = new Date();
    const birth = new Date(birthdayStr + 'T00:00:00');

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if(monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age >= minAge && age <= maxAge;
}

exports.createStudent = async function(req, res) {
    try {
        const { class_id, email, password, first_name, surname, patronymic, birthday } = req.body;

        const userPatch = {}
        userPatch.role = 'Student';
        
        if(email === undefined || email === null) {
            return res.status(400).json({ message: 'Логин не указан' });
        }
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Логин неправилен' });
        }
        userPatch.email = email

        if(first_name === undefined || first_name === null) {
            return res.status(400).json({ message: 'Имя не указано' });
        }
        if(!nameRegex.test(first_name)) {
            return res.status(400).json({ message: 'Имя неправильное' });
        }
        userPatch.first_name = first_name

        if(surname === undefined || surname === null) {
            return res.status(400).json({ message: 'Фамилия не указана' });
        }
        if(!nameRegex.test(surname)) {
            return res.status(400).json({ message: 'Фамилия неправильная' });
        }
        userPatch.surname = surname

        if(patronymic !== undefined && patronymic !== null && patronymic.trim() !== "") {
            if(!nameRegex.test(patronymic)) {
                return res.status(400).json({ message: 'Отчество неправильное' });
            }
            userPatch.patronymic = patronymic
        }
        
        if(password === undefined || password === null) {
            return res.status(400).json({ message: 'Пароль не указан' });
        }
        if(password.length < 4 || password.length > 80) {
            return res.status(400).json({ message: 'Пароль должен быть от 4 до 80 символов' })
        }
        userPatch.password_hash = await bcrypt.hash(password, 10);


        if(!isAgeValid(birthday, 6, 18)) {
            return res.status(400).json({ message: 'Возраст должен быть от 6 до 18' });
        }

        const existingUser = await User.findOne({where: {email: userPatch.email}});
        if(existingUser) {
            return res.status(400).json({ message: 'Такой пользователь уже есть' });
        }

        const user = await User.create(userPatch);
        const student = await Student.create({user_id: user.id, class_id, birthday});

        res.json(student);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateStudent = async function(req, res) {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student)
            return res.status(404).json({ message: 'Не найдено' });

        const { email, password, first_name, surname, patronymic, class_id } = req.body;

        const userPatch = {}
        if(email !== undefined) {
            if(!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Логин неправилен' });
            }
            userPatch.email = email
        }
        if(first_name !== undefined) {
            if(!nameRegex.test(first_name)) {
                return res.status(400).json({ message: 'Имя неправильное' });
            }
            userPatch.first_name = first_name
        }
        if(surname !== undefined) {
            if(!nameRegex.test(surname)) {
                return res.status(400).json({ message: 'Фамилия неправильная' });
            }
            userPatch.surname = surname
        }
        if(patronymic !== undefined) {
            if(patronymic === null || patronymic == "") {
                userPatch.patronymic = "";
            } else {
                if(!nameRegex.test(patronymic)) {
                    return res.status(400).json({ message: 'Отчество неправильное' });
                }
                userPatch.patronymic = patronymic
            }
        }
        if(password !== undefined) {
            if(password.length < 4 || password.length > 80) {
                return res.status(400).json({ message: 'Пароль должен быть от 4 до 80 символов' })
            }
            userPatch.password_hash = await bcrypt.hash(password, 10)
        }

        const user = await User.findByPk(student.user_id);
        if(Object.keys(userPatch).length > 0) {
            await user.update( userPatch );
        }

        if(class_id !== undefined) {
            student.class_id = class_id;
            await student.save();
        }

        res.json(student);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}


exports.createTeacher = async function(req, res) {
    try {
        const { email, password, first_name, surname, patronymic, subject_id } = req.body;

        const exists = await Subject.count({ where: { id: subject_id } });
        if(exists === 0) {
            return res.status(404).json({ message: 'Предмет не найден' });
        }

        const userPatch = {}
        userPatch.role = 'Teacher';
        
        if(email === undefined || email === null) {
            return res.status(400).json({ message: 'Логин не указан' });
        }
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Логин неправилен' });
        }
        userPatch.email = email

        if(first_name === undefined || first_name === null) {
            return res.status(400).json({ message: 'Имя не указано' });
        }
        if(!nameRegex.test(first_name)) {
            return res.status(400).json({ message: 'Имя неправильное' });
        }
        userPatch.first_name = first_name

        if(surname === undefined || surname === null) {
            return res.status(400).json({ message: 'Фамилия не указана' });
        }
        if(!nameRegex.test(surname)) {
            return res.status(400).json({ message: 'Фамилия неправильная' });
        }
        userPatch.surname = surname

        if(patronymic !== undefined && patronymic !== null && patronymic.trim() !== "") {
            if(!nameRegex.test(patronymic)) {
                return res.status(400).json({ message: 'Отчество неправильное' });
            }
            userPatch.patronymic = patronymic
        }
        
        if(password === undefined || password === null) {
            return res.status(400).json({ message: 'Пароль не указан' });
        }
        if(password.length < 4 || password.length > 80) {
            return res.status(400).json({ message: 'Пароль должен быть от 4 до 80 символов' })
        }
        userPatch.password_hash = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({where: {email: userPatch.email}});
        if(existingUser) {
            return res.status(400).json({ message: 'Такой пользователь уже есть' });
        }

        const user = await User.create(userPatch)
        const teacher = await Teacher.create({user_id: user.id, subject_id});

        res.json(teacher);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateTeacher = async function(req, res) {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher)
            return res.status(404).json({ message: 'Не найдено' });

        const { email, password, first_name, surname, patronymic, subject_id } = req.body;

        const userPatch = {}
        if(email !== undefined) {
            if(!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Логин неправилен' });
            }
            userPatch.email = email
        }
        if(first_name !== undefined) {
            if(!nameRegex.test(first_name)) {
                return res.status(400).json({ message: 'Имя неправильное' });
            }
            userPatch.first_name = first_name
        }
        if(surname !== undefined) {
            if(!nameRegex.test(surname)) {
                return res.status(400).json({ message: 'Фамилия неправильная' });
            }
            userPatch.surname = surname
        }
        if(patronymic !== undefined) {
            if(patronymic === null || patronymic == "") {
                userPatch.patronymic = "";
            } else {
                if(!nameRegex.test(patronymic)) {
                    return res.status(400).json({ message: 'Отчество неправильное' });
                }
                userPatch.patronymic = patronymic
            }
        }
        if(password !== undefined) {
            if(password.length < 4 || password.length > 80) {
                return res.status(400).json({ message: 'Пароль должен быть от 4 до 80 символов' })
            }
            userPatch.password_hash = await bcrypt.hash(password, 10)
        }

        const user = await User.findByPk(teacher.user_id);
        if(Object.keys(userPatch).length > 0) {
            await user.update( userPatch );
        }

        if(subject_id !== undefined) {
            teacher.subject_id = subject_id;
            await teacher.save();
        }
        res.json(teacher);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.createAdmin = async function(req, res) {
    try {
        const { email, password, first_name, surname, patronymic } = req.body;

        const userPatch = {}
        userPatch.role = 'Admin';
        
        if(email === undefined || email === null) {
            return res.status(400).json({ message: 'Логин не указан' });
        }
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Логин неправилен' });
        }
        userPatch.email = email

        if(first_name === undefined || first_name === null) {
            return res.status(400).json({ message: 'Имя не указано' });
        }
        if(!nameRegex.test(first_name)) {
            return res.status(400).json({ message: 'Имя неправильное' });
        }
        userPatch.first_name = first_name

        if(surname === undefined || surname === null) {
            return res.status(400).json({ message: 'Фамилия не указана' });
        }
        if(!nameRegex.test(surname)) {
            return res.status(400).json({ message: 'Фамилия неправильная' });
        }
        userPatch.surname = surname

        if(patronymic !== undefined && patronymic !== null && patronymic.trim() !== "") {
            if(!nameRegex.test(patronymic)) {
                return res.status(400).json({ message: 'Отчество неправильное' });
            }
            userPatch.patronymic = patronymic
        }
        
        if(password === undefined || password === null) {
            return res.status(400).json({ message: 'Пароль не указан' });
        }
        if(password.length < 4 || password.length > 80) {
            return res.status(400).json({ message: 'Пароль должен быть от 4 до 80 символов' })
        }
        userPatch.password_hash = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({where: {email: userPatch.email}});
        if(existingUser) {
            return res.status(400).json({ message: 'Такой пользователь уже есть' });
        }

        const user = await User.create(userPatch)
        res.json(user);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateAdmin = async function(req, res) {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] },
        });
        if (!user)
            return res.status(404).json({ message: 'Не найдено' });

        const { email, password, first_name, surname, patronymic } = req.body;

        const userPatch = {}
        if(email !== undefined) {
            if(!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Логин неправилен' });
            }
            userPatch.email = email
        }
        if(first_name !== undefined) {
            if(!nameRegex.test(first_name)) {
                return res.status(400).json({ message: 'Имя неправильное' });
            }
            userPatch.first_name = first_name
        }
        if(surname !== undefined) {
            if(!nameRegex.test(surname)) {
                return res.status(400).json({ message: 'Фамилия неправильная' });
            }
            userPatch.surname = surname
        }
        if(patronymic !== undefined) {
            if(patronymic === null || patronymic == "") {
                userPatch.patronymic = "";
            } else {
                if(!nameRegex.test(patronymic)) {
                    return res.status(400).json({ message: 'Отчество неправильное' });
                }
                userPatch.patronymic = patronymic
            }
        }
        if(password !== undefined) {
            if(password.length < 4 || password.length > 80) {
                return res.status(400).json({ message: 'Пароль должен быть от 4 до 80 символов' })
            }
            userPatch.password_hash = await bcrypt.hash(password, 10)
        }

        if(Object.keys(userPatch).length > 0) {
            await user.update( userPatch );
        }
        res.json(user);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.deleteAdmin = async function(req, res) {
    try {
        if(Number(req.user.id) === Number(req.params.id))  {
            return res.status(400).json({ message: 'Нельзя удалить себя' });
        }
        const user = await User.findByPk(req.params.id);
        if(!user) {
            return res.status(404).json({ message: 'Не найдено' });
        }
        if(user.role !== 'Admin') {
            return res.status(400).json({ message: 'Не админ' });
        }
        await User.destroy({where: {id: req.params.id}});
        res.status(200).json({ message: "Админ удалён" });
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.listUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'email', 'first_name', 'surname', 'patronymic'] });
        res.json(users);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
};


// -----Schedules

exports.createSchedule = async function(req, res) {
    try {
        const { date, lesson_number, subject_id, teacher_id, class_id, classroom_id  } = req.body;

        const subjectExists = await Subject.count({ where: { id: subject_id } });
        if(subjectExists === 0) {
            return res.status(404).json({ message: 'Предмет не найден' });
        }

        const subject = await Subject.findByPk(subject_id);
        const teacher = await Teacher.findByPk(teacher_id);
        const s_class = await Class.findByPk(class_id);
        const classroom = await Classroom.findByPk(classroom_id);

        const curr_date = new Date((await SchoolSetting.findOne()).curr_date);
        curr_date.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        if(targetDate.getTime() < curr_date.getTime())
            return res.status(400).json({ message: "Дата должна быть текущая или в будущем" });

        if(!date || !lesson_number || !subject || !teacher || !s_class || !classroom)
            return res.status(404).json({ message: "Не найдено" });
        if(lesson_number < 1 || lesson_number > 8)
            return res.status(400).json({ message: "Неправильный номер урока" });

        const lesson = await Schedule.create({ date, lesson_number, subject_id, teacher_id, class_id, classroom_id  })
        res.json(lesson);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateSchedule = async function(req, res) {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule)
            return res.status(404).json({ message: 'Не найдено' });

        const { date, lesson_number, subject_id, teacher_id, class_id, classroom_id  } = req.body;

        const subject = await Subject.findByPk(subject_id);
        const teacher = await Teacher.findByPk(teacher_id);
        const s_class = await Class.findByPk(class_id);
        const classroom = await Classroom.findByPk(classroom_id);

        if(!date || !lesson_number || !subject || !teacher || !s_class || !classroom)
            return res.status(404).json({ message: "Не найдено" });

        const lesson = await schedule.update({ date, lesson_number, subject_id, teacher_id, class_id, classroom_id  })
        res.json(lesson);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.deleteSchedule = async function(req, res) {
    try {
        const deletedCount = await sequelize.transaction(async(t) => {
            await Grade.destroy({where: {schedule_id: req.params.id}, transaction: t});
            return await Schedule.destroy({where: {id: req.params.id}, transaction: t});
        });
        if(deletedCount === 0) {
            return res.status(404).json({ message: "Не найдено" });
        }
        res.status(200).json({ message: "Удалено" });
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
    
}

// -----Class

exports.createClass = async function(req, res) {
    try {
        const { name, year } = req.body;
        
        if(name === undefined || name === null || year === undefined || year === null) {
            return res.status(400).json({ message: 'Не указаны данные' });
        }
        if(year > 11 || year < 0) {
            return res.status(400).json({ message: "Неправильный год" });
        }
        if(name.length != 1) {
            return res.status(400).json({ message: "Неправильная буква класса" });
        }

        const s_class = await Class.create({name, year});

        res.json(s_class);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateClass = async function(req, res) {
    try {
        const s_class = await Class.findByPk(req.params.id);
        if (!s_class)
            return res.status(404).json({ message: 'Не найдено' });

        const { name, year } = req.body;
        
        if(name === undefined || name === null || year === undefined || year === null) {
            return res.status(400).json({ message: 'Не указаны данные' });
        }
        if(year > 11 || year < 0) {
            return res.status(400).json({ message: "Неправильный год" });
        }
        if(name.length != 1) {
            return res.status(400).json({ message: "Неправильная буква класса" });
        }

        const updatedClass = await s_class.update({ name, year  });
        res.json(updatedClass);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.deleteClass = async function(req, res) {
    try {
        const deletedCount = await sequelize.transaction(async(t) => {
            await Student.destroy({where: {class_id: req.params.id}, transaction: t});
            return await Class.destroy({where: {id: req.params.id}, transaction: t});
        });
        if(deletedCount === 0) {
            return res.status(404).json({ message: "Не найдено" });
        }
        res.status(200).json({ message: "Удалено" });
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

// -----Subjects

exports.createSubject = async function (req, res) {
    try {
        var { name, educ_level } = req.body;
        
        if(name === undefined || name === null || educ_level === undefined || educ_level === null) {
            return res.status(400).json({ message: 'Не указаны данные' });
        }
        if(educ_level > 4 || educ_level <= 0) {
            return res.status(400).json({ message: "Неправильный уровень предмета" });
        }
        if(name.length > 80 || name.length == 0) {
            return res.status(400).json({ message: "Неправильное имя" });
        }

        const subject = await Subject.create({name, educ_level});

        res.json(subject);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateSubject = async function(req, res) {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject)
            return res.status(404).json({ message: 'Не найдено' });

        var { name, educ_level } = req.body;
        
        if(name === undefined || name === null || educ_level === undefined || educ_level === null) {
            return res.status(400).json({ message: 'Не указаны данные' });
        }
        if(educ_level > 4 || educ_level <= 0) {
            return res.status(400).json({ message: "Неправильный уровень предмета" });
        }
        if(name.length > 80 || name.length == 0) {
            return res.status(400).json({ message: "Неправильное имя" });
        }

        const updatedSubject = await subject.update({ name, educ_level  });
        res.json(updatedSubject);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.deleteSubject = async function(req, res) {
    try {
        const deletedCount = await sequelize.transaction(async(t) => {
            await Teacher.destroy({where: {subject_id: req.params.id}, transaction: t});
            await Schedule.destroy({where: {subject_id: req.params.id}, transaction: t});
            return await Subject.destroy({where: {id: req.params.id}, transaction: t});
        });
        if(deletedCount === 0) {
            return res.status(404).json({ message: "Не найдено" });
        }
        res.status(200).json({ message: "Удалено" });
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

// -----SchoolSetting

exports.setCurrentDay = async function(req, res) {
    try {
        if(!req.body.date)
            return res.status(400).json({ message: "Даты нет"});
        const date = new Date(req.body.date);
        const curr_date = new Date(((await SchoolSetting.findOne()).curr_date));

        if(date.getTime() <= curr_date.getTime())
            return res.status(400).json({ message: "Дата должна быть будещей" });

        const schoolSetting = await (SchoolSetting.findOne())
        schoolSetting.curr_date = req.body.date;
        await schoolSetting.save();

        res.status(200).json({ message: "Изменено" });
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}