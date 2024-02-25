const express = require('express');
const router = express.Router();

const products = require('../data/products.json');
const usersData = require('../data/users.json');


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
    res.status(404).json({
      message: 'Incorrect Username or Password',
      status: 'error'
    });
  }
 
});

// Define a fallback for other paths, not found
router.use('*', (req, res) => {
  res.status(404).json({
    message: 'Not Found',
    status: 'error'
  });
});

module.exports = router;
