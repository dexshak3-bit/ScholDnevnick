const jwt = require('jsonwebtoken');

module.exports = (...roles) => (req, res, next) => {
    if(!req.user)
        return res.status(400).json({ message: "Not user" });
    if(!roles.includes(req.user.role))
        return res.status(403).json({ message: "Forbidden" });
    next();
}