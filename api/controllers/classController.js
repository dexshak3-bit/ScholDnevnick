const { Class } = require('../models/index');

exports.getClasses = async function(req, res) {
    try {
        const classes = await Class.findAll();
        res.json(classes);
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}