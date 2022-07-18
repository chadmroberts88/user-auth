const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Account = require('../models/AccountModel');
const auth = require('../middleware/AuthMiddleware');
const upload = require('../middleware/UploadMiddleware');

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

const validateAccount = (account) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string()
  });
  return schema.validate(account);
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
REQ: NewUser object
RES: 200 (User object), 400 (Bad request), 500 (Server error)
*/

router.post('/', upload.single('photo'), async (req, res) => {

  const { error, value } = validateNewUser(req.body);
  if (error) return res.status(400).json({ error: 'Bad request.' });

  try {

    if (req.file) {
      value.fileName = req.file.originalname;
      value.photo = req.file.buffer.toString('base64');
    } else {
      value.fileName = null;
      value.photo = null;
    }

    const salt = await bcrypt.genSalt(10);
    value.account.password = await bcrypt.hash(value.account.password, salt);
    const result = await Account.createAccount(value);
    const token = Account.generateAuthToken(result.id);
    return res.header('x-auth-token', token).status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }

});

/*
METHOD: PATCH
ROUTE: /api/account/
REQ: Account object
RES: 200 (Updated), 400 (Bad request), 500 (Server error)
*/

router.patch('/', auth, async (req, res) => {

  const { error, value } = validateAccount(req.body);
  if (error) return res.status(400).json({ error: 'Bad request.' });

  try {
    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);
    }
    await Account.updateAccount(req.id, value);
    return res.status(200).json({ result: 'Account updated.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }

});

/*
METHOD: DELETE
ROUTE: /api/account/
REQ: None
RES: 200 (Account deleted), 500 (Server error)
*/

router.delete('/', auth, async (req, res) => {

  try {
    await Account.deleteAccount(req.id);
    return res.status(200).json({ message: 'Account deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
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
    const result = await Account.authenticateUser(value);
    const validPass = await bcrypt.compare(value.password, result.data.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ id: result.data.id }, process.env.JWT_KEY);
    return res.status(result.code).json({ token: token });
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }

});

module.exports = router;