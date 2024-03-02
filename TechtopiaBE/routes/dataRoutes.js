const express = require('express');
const router = express.Router();
const fetchCategories = require('../middlewares/categoriesMiddleware');
const fetchOrders = require('../middlewares/ordersMiddleware');

router.get('/data', fetchCategories, fetchOrders, (req, res) => {
  res.json({
    categories: req.categories,
    orders: req.orders
  });
});

module.exports = router;