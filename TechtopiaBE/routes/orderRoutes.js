const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const fetchUsers = require('../middlewares/usersMiddleware');
const fetchOrders = require('../middlewares/ordersMiddleware');
const Order = require('../models/orderModel');

router.post('/submitOrder', fetchUsers, fetchOrders, async (req, res) => {
  const order = req.body;

  const orderId = 'o-' + uuid.v4();
  order.orderId = orderId;

  console.log( 'ORDER ID ---> ', order)

  try {
    async function saveOrder() {
      try {
          // Find the user by userId
          const foundUser = await userModel.findOne({'userId': order.userId});

          // If user not found, return 404
          if (!foundUser) {
            return res.status(404).send('User not found');
          }

          // Add the new order to the user's orders array
          foundUser.orders.push( order );

          // Save the updated user
          const savedUser = await foundUser.save();

          // Create a new order instance
          const newOrder = new Order( order );

          // Save the new order
          const savedorder = await newOrder.save();

          // Respond with success message
          res.status(200).send('Order submitted successfully');
      } catch (error) {
          console.error(error);
      }
    }
  
    saveOrder();

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
