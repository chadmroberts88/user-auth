const Sequelize = require('sequelize');
const db = require('../utils/Database');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const Game = db.define('Games', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  multiplier: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tileIds: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tiles: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  account_id: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  }
});

// ------ CREATE Operations ------

/*
Handled by AccountModel
*/

// ------ READ Operations ------

const readGame = async (accountId) => {
  try {
    const result = await Game.findAll({
      where: {
        account_id: accountId
      }
    });
    return {
      score: result[0].score,
      multiplier: result[0].multiplier,
      tileIds: result[0].tileIds,
      tiles: result[0].tiles
    };
  } catch (error) {
    return error;
  }
};

// ------ UPDATE Operations ------

const updateGame = async (accountId, game) => {
  try {
    await Game.update({
      ...game
    }, {
      where: {
        account_id: accountId
      }
    });
    return;
  } catch (error) {
    throw error;
  }
};

// ------ DELETE Operations ------

/*
Handled by AccountModel
*/

module.exports = {
  Game,
  readGame,
  updateGame
}