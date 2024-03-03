const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuid = require('uuid');
const fetchUsers = require('../middlewares/usersMiddleware');
const User = require('../models/userModel');

router.post('/login', fetchUsers, async (req, res) => {
  try {
    const reqData = req.body;

    const user = await User.findOne({ 'username': reqData.username, 'password': reqData.password });

    if (user) {
      res.json({
        userId: user.userId,
        username: user.username,
        orders: user.orders
      });
    } else {
      res.json({
        ok: false,
        message: 'Incorrect Username or Password',
        status: 'error'
      });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/register', fetchUsers, async (req, res) => {
  const newUser = req.body;

  // On register o xristis tha exei kai ena adeio array me orders

  const userId = 'u-' + uuid.v4();
  newUser.userId = userId;

  try {
    async function saveUser() {
      try {
          // Add the new order to the user's orders array
          const newUserCreated = new User( newUser );

          // Save the updated user
          const savedUser = await newUserCreated.save();

          // Respond with success message
          res.status(200).send('User registered successfully');
      } catch (error) {
          console.error(error);
      }
    }
    res.json({
      username: newUser.username,
      orders: newUser.orders
    });
    saveUser();

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
