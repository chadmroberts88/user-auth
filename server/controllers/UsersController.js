const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const Users = require('../models/UserModel');

router.use(express.json());

const validateNewUser = (newUser) => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    soundOn: Joi.number().integer().max(1).min(0).required(),
    darkModeOn: Joi.number().integer().max(1).min(0).required(),
    useSwipeOn: Joi.number().integer().max(1).min(0).required(),
    best: Joi.number().integer().min(0).required()
  });
  return schema.validate(newUser);
}

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5),
    email: Joi.string().email(),
    password: Joi.string(),
    soundOn: Joi.number().integer().max(1).min(0),
    darkModeOn: Joi.number().integer().max(1).min(0),
    useSwipeOn: Joi.number().integer().max(1).min(0),
    best: Joi.number().integer().min(0)
  });
  return schema.validate(user);
}

const validateCredentials = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(user);
}


/*
METHOD: POST
ROUTE: /api/users/
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
    - userData
  
  400, Bad request:
    - validation failed
    - SQL query failed
    - user not created

*/

router.post('/', async (req, res) => {

  const { error, value } = validateNewUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const salt = await bcrypt.genSalt(10);
  value.password = await bcrypt.hash(value.password, salt);

  try {
    const result = await Users.createUser(value);
    if (result) return res.status(result.code).json(result.data);
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }

});


/*
METHOD: PATCH
ROUTE: /api/users/:id
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

  200, Ok:
    - updated userData
  
  400, Bad Request:
    - validation failed
    - SQL query failed
  
  404, Resource not found:
    - user not found
  
*/

router.patch('/:id', async (req, res) => {

  const { id } = req.params;
  const { error, value } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await Users.updateUserData(id, value);
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }

});

/*
METHOD: DELETE
ROUTE: /api/users/:id
REQUEST BODY:

  None

RESPONSES:

  200, Ok:
    - user deleted
  
  400, Bad Request:
    - SQL query failed
  
  404, Resource not found:
    - user not found
  
*/

router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  try {
    const result = await Users.deleteUser(id);
    return res.status(result.code).json(result.message);
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }

});

/*
METHOD: GET
ROUTE: /api/users/best/:qty
REQUEST BODY:

  None

RESPONSES:

  200, Ok:
    - list of users
  
  400, Bad Request:
    - SQL query failed
  
  404, Resource not found:
    - no users found
  
*/

router.get('/best/:qty', async (req, res) => {

  const { qty } = req.params;

  try {
    const result = await Users.getBest(qty);
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }
});

/*
METHOD: GET
ROUTE: /api/users/:id
REQUEST BODY:

  None

RESPONSES:

  200, Ok:
    - list of users
  
  400, Bad Request:
    - SQL query failed
  
  404, Resource not found:
    - no users found
  
*/

router.get('/:id', async (req, res) => {

  const { id } = req.params;

  try {
    const result = await Users.getUser(id);
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }
});


/*
METHOD: POST
ROUTE: /api/logins
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

router.post('/auth', async (req, res) => {

  const { error, value } = validateCredentials(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await Users.authenticateUser(value);
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }

});

module.exports = router;