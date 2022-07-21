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
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    soundOn: Joi.boolean().required(),
    darkModeOn: Joi.boolean().required(),
    useSwipeOn: Joi.boolean().required(),
    best: Joi.number().integer().min(0).required(),
    score: Joi.number().integer().min(0).required(),
    multiplier: Joi.number().integer().min(1).required(),
    tileIds: Joi.number().integer().min(0).required(),
    tiles: Joi.string().required()
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
RES: 200 (User object), 400 (Bad request), 500 (Error)
*/

router.post('/', upload.none(), async (req, res) => {

  const { error, value } = validateNewUser(req.body);
  if (error) return res.status(400).json(error);

  try {
    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);
    const result = await Account.createAccount(value);
    const token = Account.generateAuthToken(result.id);
    return res.header('x-auth-token', token).status(200).json(result);
  } catch (error) {
    const errorMsgs = [];
    let errorToSend = 'Registration error.'
    error.errors.forEach(item => errorMsgs.push(item.message));
    if (errorMsgs.includes('username must be unique')) {
      errorToSend = "Username is already in use."
    }
    return res.status(500).json(errorToSend);
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
  if (error) return res.status(400).json({ message: 'Bad request.' });

  try {
    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);
    }
    await Account.updateAccount(req.id, value);
    return res.status(200).json({ message: 'Account updated.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
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
    return res.status(500).json({ message: 'Server error.' });
  }

});

/*
METHOD: POST
ROUTE: /api/account/auth
REQ: Account object
RES: 200 (Login successful, Set token), 400 (Invalid credentials), 500 (Server error)
*/

router.post('/auth', upload.none(), async (req, res) => {

  const { error, value } = validateCredentials(req.body);
  if (error) return res.status(400).json({ message: 'Invalid credentials.' });

  try {
    const result = await Account.authenticateAccount(value.email);
    const validPass = await bcrypt.compare(value.password, result.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid credentials.' });
    const token = Account.generateAuthToken(result.id);
    return res.header('x-auth-token', token).status(200).json({ message: 'Login successful.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }

});

module.exports = router;