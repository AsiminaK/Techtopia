const express = require('express');
const router = express.Router();

const products = require('../data/products.json');
const ordersData = require('../data/orders.json');
const usersData = require('../data/users.json');

const fs = require('fs');
const uuid = require('uuid');

// Define a GET route for /example
router.get('/data', (req, res) => {
  res.json({
    products: products,
    orders: ordersData
  });
});

router.post('/submitOrder', (req, res) => {
  const order = req.body;

  const orderId = 'o-' + uuid.v4();
  order.orderId = orderId;

  console.log(order);
  ordersData.orders.push(order);

  // Find the user who placed the order
  const userIndex = usersData.users.findIndex(user => user.userId === order.userId);
  if (userIndex !== -1) {
    // Update the user's orders array
    usersData.users[userIndex].orders.push({ orderId });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }

  fs.writeFile('./data/orders.json', JSON.stringify(ordersData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to orders.json:', err);
      return res.status(500).json({
        message: 'Error submitting order',
        error: err
      });
    } else {
      console.log('Order submitted successfully');
      fs.writeFile('./data/users.json', JSON.stringify(usersData, null, 2), (err) => {
        if (err) {
          console.error('Error writing to users.json:', err);
          return res.status(500).json({
            message: 'Error updating user data',
            error: err
          });
        }
        console.log('User data updated successfully');
        res.json({
          newOrder: order
        });
      });
    }
  });
});



router.post('/login', (req, res) => {
  console.log(req.body);
  reqData = req.body;

  const userFound = usersData.users.find((user) => user.username === reqData.username && user.password === reqData.password)
  
  if (userFound) {
    res.json({
      userId: userFound.userId,
      username: userFound.username,
      orders: userFound.orders
    });
  }
  else {
    res.json({
      ok: false,
      message: 'Incorrect Username or Password',
      status: 'error'
    });
  }
 
});

router.post('/register', (req, res) => {
  const newUser = req.body;

  const userId = 'u-' + uuid.v4();
  newUser.userId = userId;

  console.log(newUser);
  usersData.users.push(newUser);

  fs.writeFile('./data/users.json', JSON.stringify(usersData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to users.json:', err);
      res.status(404).json({
        message: 'Error registering user',
        error: err
      });
    } else {
      console.log('User registered successfully');
      res.json({
        username: newUser.username,
        orders: newUser.orders
      });
    }
  });
});

// Define a fallback for other paths, not found
router.use('*', (req, res) => {
  res.status(404).json({
    message: 'Not Found',
    status: 'error'
  });
});

module.exports = router;
