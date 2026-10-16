const { Subject } = require('../models/index');

exports.getSubjects = async function(req, res) {
    try {
        const subjects = await Subject.findAll();
        if(!subjects) {
            return res.status(404).json({ message: "Не найдено"});
        }
        res.json(subjects);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getSubjectById = async function(req, res) {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if(!subject) {
            return res.status(404).json({ message: "Не найдено"});
        }
        res.json(subject);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}