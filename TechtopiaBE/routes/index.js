const express = require('express');
const router = express.Router();

// Import individual route files
const authRoutes = require('./authRoutes');
const dataRoutes = require('./dataRoutes');
const orderRoutes = require('./orderRoutes');
const fallbackRoutes = require('./fallbackRoutes');

// Use individual route files
router.use('/', authRoutes);
router.use('/', dataRoutes);
router.use('/', orderRoutes);
router.use('/', fallbackRoutes);

module.exports = router;
