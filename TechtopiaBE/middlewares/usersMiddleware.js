const User = require('../models/userModel');

async function fetchUsers(req, res, next) {
    try {
        const users = await User.find();
        req.users = users;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = fetchUsers; 
