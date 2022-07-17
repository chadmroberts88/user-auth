const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Games = require('../models/GameModel');

/*
METHOD: POST
ROUTE: /api/games/create
REQUEST BODY:
  { 
    username:
    tiles:
    tileIds:
    multiplier:
    score:
  }

RESPONSES:
  201 - Created:
    { message: 'Game created sucessfully.' }
  
  400 - Bad Request:
    { message: 'Game not created.' }
  
  404 - Not Found:
    {message: 'User not found in database.'}
*/

router.post('/create', (req, res) => {
  res.send({ message: 'Create request recieved...' });
});

/*
METHOD: GET
ROUTE: /api/games/load
REQUEST BODY:
  { 
    username:
  }

RESPONSES:
  200 - Ok:
    {
      tiles:
      tileIds:
      multiplier:
      score:
    }
  
  404 - Not Found:
    {message: 'User not found in database.'}
*/

router.get('/load', (req, res) => {
  res.send({ message: 'Load request recieved...' });
});

/*
METHOD: PUT
ROUTE: /api/games/update
REQUEST BODY:
  { 
    username:
    tiles:
    tileIds:
    multiplier:
    score:
  }

RESPONSES:
  200 - Ok:
    { message: 'Game updated.'}
  
  404 - Not Found:
    {message: 'User not found in database.'}
*/

router.put('/update', (req, res) => {
  res.send({ message: 'Update request recieved...' });
});

/*
METHOD: DELETE
ROUTE: /api/games/delete
REQUEST BODY:
  { 
    username:
  }

RESPONSES:
  200 - Ok:
    { message: 'Game deleted.'}
  
  404 - Not Found:
    {message: 'User not found in database.'}
*/

router.delete('/delete', (req, res) => {
  res.send({ message: 'Delete request recieved...' });
});

module.exports = router;