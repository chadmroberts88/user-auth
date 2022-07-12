const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Users = require('../models/UserModel');

const validateNewUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    soundOn: Joi.boolean().required(),
    darkModeOn: Joi.boolean().required(),
    useSwipeOn: Joi.boolean().required(),
    best: Joi.number().integer().required()
  });
  return schema.validate(user);
}

const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(user);
}

/*
METHOD: POST
ROUTE: /api/users/register
REQUEST BODY:
  { 
    username: 
    email:
    password:
    soundOn:
    darkModeOn:
    useSwipeOn:
    best: 
    photo:
  }

RESPONSES:
  201 - Created:
    { message: 'User created sucessfully.' }
  
  400 - Bad Request:
    { message: 'User not created.' }
  
*/

router.post('/register', async (req, res) => {

  const { error, value } = validateNewUser(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const result = await Users.createUser({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      soundOn: req.body.soundOn,
      darkModeOn: req.body.darkModeOn,
      useSwipeOn: req.body.useSwipeOn,
      best: req.body.best
    });
    if (result) return res.status(result.code).send(result.message);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }

});

/*
METHOD: POST
ROUTE: /api/users/login
REQUEST BODY:
  { 
    email:
    password:
  }
RESPONSES:
  200 - Ok:
    { 
      username: 
      email:
      password:
      soundOn:
      darkModeOn:
      useSwipeOn:
      best: 
      rank: 
      photo:
    }
  
  400 - Bad Request:
    { message: 'Password does not match.' }

  404 - Not Found:
    { message: 'User not found in database.' }
*/

router.post('/login', async (req, res) => {

  const { error, value } = validateLogin(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const result = await Users.logInUser({
      email: req.body.email,
      password: req.body.password
    });
    return res.status(result.code).send(result.message);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }

});

// Update user info
router.put('/info', (req, res) => {
  console.log(req.body);
  res.send({ message: 'Update user info request recieved...' });
});

// Delete user info
router.delete('/delete', (req, res) => {
  console.log(req.body);
  res.send({ message: 'Delete user info request recieved...' });
});

// Get top 50 users
router.get('/leaderboad', (req, res) => {
  console.log(req.body);
  res.send({ message: 'Leaderboard request recieved...' });
});

// Update user settings
router.put('/settings', (req, res) => {
  console.log(req.body);
  res.send({ message: 'Update user settings request recieved...' });
});

module.exports = router;