const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Auth = require('../models/AuthModel');

dotenv.config({ path: './.env' });

router.use(express.json());

const validateCredentials = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(user);
}


/*
METHOD: POST
ROUTE: /api/auth
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

router.post('/', async (req, res) => {

  const { error, value } = validateCredentials(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await Auth.authenticateUser(value);
    const validPass = await bcrypt.compare(value.password, result.data.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ id: result.data.id }, process.env.JWT_KEY);
    return res.status(result.code).json({ token: token });
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }

});

module.exports = router;