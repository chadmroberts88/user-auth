const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Users = require('../models/UserModel');

const validateNewUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    soundOn: Joi.number().integer().max(1).min(0).required(),
    darkModeOn: Joi.number().integer().max(1).min(0).required(),
    useSwipeOn: Joi.number().integer().max(1).min(0).required(),
    best: Joi.number().integer().min(0).required()
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

const validateUsername = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(5).required()
  });
  return schema.validate(user);
}

const validatePassword = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(user);
}

const validateEmail = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    newEmail: Joi.string().email().required()
  });
  return schema.validate(user);
}

const validateSettings = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    soundOn: Joi.number().integer().max(1).min(0).required(),
    darkModeOn: Joi.number().integer().max(1).min(0).required(),
    useSwipeOn: Joi.number().integer().max(1).min(0).required()
  });
  return schema.validate(user);
}

const validateDelete = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
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

  201, Resource created:
    - user created
  
  400, Bad request:
    - validation failed
    - SQL query failed

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

  200,Ok:

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
  
  400, Bad request:
    - SQL query failed
    - passwords do not match

  404, Resource not found:
    - user not found
*/

router.post('/login', async (req, res) => {

  const { error, value } = validateLogin(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const result = await Users.logInUser({
      email: req.body.email,
      password: req.body.password
    });
    return res.status(result.code).send(result.data);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }

});

/*
METHOD: PUT
ROUTE: /api/users/username
REQUEST BODY:

  { 
    email:
    username:
  }

RESPONSES:

  200, Ok:
    - username updated
  
  400, Bad Request:
    - validation failed
    - SQL query failed
  
  404, Resource not found:
    - user not found
  
*/

router.put('/username', async (req, res) => {

  const { error } = validateUsername(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const result = await Users.updateUsername({
      email: req.body.email,
      username: req.body.username
    });
    return res.status(result.code).send(result.message);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }

});

/*
METHOD: PUT
ROUTE: /api/users/password
REQUEST BODY:

  { 
    email:
    password:
  }

RESPONSES:

  200, Ok:
    - password updated
  
  400, Bad Request:
    - validation failed
    - SQL query failed
  
  404, Resource not found:
    - user not found
  
*/

router.put('/password', async (req, res) => {

  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const result = await Users.updatePassword({
      email: req.body.email,
      password: req.body.password
    });
    return res.status(result.code).send(result.message);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }

});

/*
METHOD: PUT
ROUTE: /api/users/email
REQUEST BODY:

  { 
    email:
    newEmail:
  }

RESPONSES:

  200, Ok:
    - email updated
  
  400, Bad Request:
    - validation failed
    - SQL query failed
  
  404, Resource not found:
    - user not found
  
*/

router.put('/email', async (req, res) => {

  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const result = await Users.updateEmail({
      email: req.body.email,
      newEmail: req.body.newEmail
    });
    return res.status(result.code).send(result.message);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }

});

/*
METHOD: PUT
ROUTE: /api/users/settings
REQUEST BODY:

  { 
    email:
    soundOn:
    darkModeOn:
    useSwipeOn:
  }

RESPONSES:

  200, Ok:
    - settings updated
  
  400, Bad Request:
    - validation failed
    - SQL query failed
  
  404, Resource not found:
    - user not found
  
*/
router.put('/settings', async (req, res) => {

  const { error } = validateSettings(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const result = await Users.updateSettings({
      email: req.body.email,
      soundOn: req.body.soundOn,
      darkModeOn: req.body.darkModeOn,
      useSwipeOn: req.body.useSwipeOn
    });
    return res.status(result.code).send(result.message);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }
});

/*
METHOD: GET
ROUTE: /api/users/leaderboard
REQUEST BODY:

  None

RESPONSES:

  200, Ok:
    
    [{
      username:
      best:
    }...]
  
  400, Bad Request:
    - SQL query failed
  
  404, Resource not found:
    - no users found
  
*/

router.get('/leaderboard', async (req, res) => {
  try {
    const result = await Users.getLeaderboardList(50);
    return res.status(result.code).send(result.data);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }
});

/*
METHOD: DELETE
ROUTE: /api/users/delete
REQUEST BODY:

  { 
    email:
  }

RESPONSES:

  200, Ok:
    - user deleted
  
  400, Bad Request:
    - validation failed
    - SQL query failed
  
  404, Resource not found:
    - user not found
  
*/

router.delete('/delete', async (req, res) => {

  const { error } = validateDelete(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const result = await Users.deleteUser({
      email: req.body.email
    });
    return res.status(result.code).send(result.message);
  } catch (error) {
    return res.status(error.code).send(error.message);
  }

});

module.exports = router;