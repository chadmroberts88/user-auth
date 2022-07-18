const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Game = require('../models/GameModel');
const auth = require('../middleware/AuthMiddleware');

const validateGame = (game) => {
  const schema = Joi.object({
    score: Joi.number().integer().min(0).required(),
    multiplier: Joi.number().integer().min(1).required(),
    tileIds: Joi.number().integer().min(0).required(),
    tiles: Joi.string().required()
  });
  return schema.validate(game);
}

// ------ POST Requests ------

/*
Handled by AccountModel
*/

// ------ GET Requests ------

/*
METHOD: GET
ROUTE: /api/game/
REQ: Header: id: x-auth-token
RES: 200 (Game object), 500 (Server error)
*/

router.get('/', auth, async (req, res) => {
  try {
    const result = await Game.readGame(req.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ------ PATCH Requests ------

/*
METHOD: PATCH
ROUTE: /api/game/
REQ: 
RES: 200 (Game updated), 400, (Bad request), 500 (Server error)
*/

router.patch('/', auth, async (req, res) => {

  const { error, value } = validateGame(req.body);
  if (error) return res.status(400).json({ message: 'Bad request.' });

  try {
    await Game.updateGame(req.id, value);
    return res.status(200).json({ message: 'Game updated.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ------ DELETE Requests ------

/*
Handled by AccountModel
*/

module.exports = router;