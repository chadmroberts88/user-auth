const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const Profile = require('../models/ProfileModel');
const auth = require('../middleware/AuthMiddleware');
const upload = require('../middleware/UploadMiddleware');

router.use(express.json());

const validateProfile = (profile) => {
  const schema = Joi.object({
    username: Joi.string().min(5),
    soundOn: Joi.number().integer().max(1).min(0),
    darkModeOn: Joi.number().integer().max(1).min(0),
    useSwipeOn: Joi.number().integer().max(1).min(0),
    best: Joi.number().integer().min(0)
  });
  return schema.validate(profile);
}

// ------ POST Requests ------

/* 
Handled by AccountController
*/

// ------ GET Requests ------

/*
METHOD: GET
ROUTE: /api/profile/
REQ: Header: id: x-auth-token
RES: 200 (Profile), 500 (Server error)
*/

router.get('/', auth, async (req, res) => {
  try {
    const result = await Profile.readProfile(req.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

/*
METHOD: GET
ROUTE: /api/profile/leaders?page=1&limit=10
REQ: Query Params: page, limit
RES: 200 (numRecords, [Leaders]), 500 (Server error)
*/

router.get('/leaders', async (req, res) => {

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const offset = (page - 1) * limit;

  try {
    const result = await Profile.readLeaders(offset, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// ------ PATCH Requests ------

/*
METHOD: PATCH
ROUTE: /api/profile/
REQ: Profile object
RES: 200 (Account updated), 400 (Bad request), 500 (Server error)
*/

router.patch('/', auth, upload.single('photo'), async (req, res) => {

  const { error, value } = validateProfile(req.body);
  if (error) return res.status(400).json({ error: 'Bad request.' });

  try {

    if (req.file) {
      value.fileName = req.file.originalname;
      value.photo = req.file.buffer.toString('base64');
    } else {
      value.fileName = null;
      value.photo = null;
    }

    const result = await Profile.updateProfile(req.id, value);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ------ DELETE Requests ------

/* 
Handled by AccountController
*/

module.exports = router;