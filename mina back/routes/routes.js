const express = require('express');
const router = express.Router();

const products = require('../data/products.json');
const usersData = require('../data/users.json');

const fs = require('fs');

// Define a GET route for /example
router.get('/data', (req, res) => {
  res.json(products);
});

router.post('/login', (req, res) => {
  console.log(req.body);
  reqData = req.body;

  const userFound = usersData.users.find((user) => user.username === reqData.username && user.password === reqData.password)
  
  if (userFound) {
    res.json({
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
