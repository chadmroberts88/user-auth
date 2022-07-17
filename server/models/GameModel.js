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

// READ Operations

const readGame = async (accountId) => {
  try {
    await Game.findAll({
      where: {
        account_id: accountId
      }
    });
    return;
  } catch (error) {
    return error;
  }
};

// UPDATE Operations

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

module.exports = {
  Game,
  readGame,
  updateGame
}