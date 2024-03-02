const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuid = require('uuid');
const fetchUsers = require('../middlewares/usersMiddleware');

router.post('/login', fetchUsers, (req, res) => {
  reqData = req.body;
  const userFound = req.users.find((user) => user.username === reqData.username && user.password === reqData.password)
  
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

router.post('/register', fetchUsers, (req, res) => {
  const newUser = req.body;

  // On register o xristis tha exei kai ena adeio array me orders

  const userId = 'u-' + uuid.v4();
  newUser.userId = userId;

  // console.log(newUser);
  req.users.push(newUser);

  fs.writeFile('./data/users.json', JSON.stringify(req.users, null, 2), (err) => {
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

module.exports = router;
