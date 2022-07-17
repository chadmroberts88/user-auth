const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Account = require('../models/AccountModel');

dotenv.config({ path: './.env' });

router.use(express.json());

const validateNewUser = (newUser) => {
  const schema = Joi.object({
    account: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    },
    profile: {
      username: Joi.string().min(5).required(),
      soundOn: Joi.boolean().required(),
      darkModeOn: Joi.boolean().required(),
      useSwipeOn: Joi.boolean().required(),
      best: Joi.number().integer().min(0).required()
    },
    game: {
      score: Joi.number().integer().min(0).required(),
      multiplier: Joi.number().integer().min(1).required(),
      tileIds: Joi.number().integer().min(0).required(),
      tiles: Joi.string().required()
    }
  });
  return schema.validate(newUser);
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
ROUTE: /api/account/
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
    - user
  
  400, Bad request:
    - validation failed

  500, 
    - SQL query failed
    - user not created

*/

router.post('/', async (req, res) => {

  const { error, value } = validateNewUser(req.body);
  if (error) return res.status(400).json(error);

  try {
    const salt = await bcrypt.genSalt(10);
    value.account.password = await bcrypt.hash(value.account.password, salt);
    const result = await Account.createAccount(value);
    const token = Account.generateAuthToken(result.id);
    return res.header('x-auth-token', token).status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }

});

/*
METHOD: POST
ROUTE: /api/accounts/auth
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