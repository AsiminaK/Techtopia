const Category = require('../models/categoryModel');

async function fetchCategories(req, res, next) {
    try {
        const categories = await Category.find();
        req.categories = categories;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = fetchCategories;
