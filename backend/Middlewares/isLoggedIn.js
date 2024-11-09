const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel')

const isLoggedIn = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); 
        req.user = await userModel.findById(decoded.id); 
        next(); 
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = isLoggedIn;
