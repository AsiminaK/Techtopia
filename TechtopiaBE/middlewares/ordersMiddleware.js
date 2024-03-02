const Order = require('../models/orderModel');

async function fetchOrders(req, res, next) {
    try {
        const orders = await Order.find();
        req.orders = orders;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = fetchOrders;
