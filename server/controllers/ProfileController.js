const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/ProfileModel');
const auth = require('../middleware/AuthMiddleware');

router.use(express.json());



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

router.patch('/', auth, async (req, res) => {

  const { error, value } = validateUser(req.body);
  if (error) return res.status(400).json({ error: 'Bad request.' });

  try {
    await User.updateUser(req.id, value);
    return res.status(200).json({ result: 'User updated.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
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
  
  204, Delete:
    - delete user
*/

router.delete('/:id', async (req, res) => {

  try {
    await User.deleteUser(req.params.id);
    return res.status(200).json({ message: 'User deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
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

router.get('/leaders/:qty', async (req, res) => {

  const { qty } = req.params;

  try {
    const result = await User.readLeaders(qty);
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
    const result = await User.readUser(id);
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }
});

module.exports = router;