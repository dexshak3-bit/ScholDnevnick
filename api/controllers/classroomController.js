const { Classroom } = require('../models/index');

exports.getClassrooms = async function(req, res) {
    try {
        const classrooms = await Classroom.findAll();
        res.json(classrooms);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}