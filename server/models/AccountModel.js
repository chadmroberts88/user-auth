const Sequelize = require('sequelize');
const db = require('../utils/Database');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { Profile } = require('./ProfileModel');
const { Game } = require('./GameModel');

dotenv.config({ path: './.env' });

// Define the Account model

const Account = db.define('Accounts', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Link the Profile and Game models to Account

Account.hasOne(Profile, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'account_id'
});

Account.hasOne(Game, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'account_id'
});

// Generate JWT for Account

const generateAuthToken = (accountId) => {
  return jwt.sign({ id: accountId }, process.env.JWT_KEY);
};

const testUser = {
  account: {
    email: 'dave@testemail.com',
    password: 'somepassword',
  },

  profile: {
    username: 'Dave',
    soundOn: 'true',
    darkModeOn: 'true',
    useSwipeOn: 'false',
    best: 80,
  },
  game: {
    score: 456,
    multiplier: 1,
    tileIds: 9,
    tiles: ['sometiles']
  }
}

// CREATE Operations

const createAccount = async (user) => {

  try {
    const result = await db.transaction(async (trans) => {

      const account = await Account.create({
        ...user.account
      }, { transaction: trans });

      const profile = await account.createProfile({
        ...user.profile
      }, { transaction: trans });

      const game = await account.createGame({
        ...user.game
      }, { transaction: trans });

      const newUser = {
        id: account.id,
        account: {
          email: account.email
        },
        profile: {
          username: profile.username,
          soundOn: profile.soundOn,
          darkModeOn: profile.darkModeOn,
          useSwipeOn: profile.useSwipeOn,
          best: profile.best
        },
        game: {
          score: game.score,
          multiplier: game.multiplier,
          tileIds: game.tileIds,
          tiles: game.tiles
        }
      };

      return newUser;
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// READ Operations

const readAccount = async (id) => {
  try {
    await Account.findAll({
      where: {
        id: id
      }
    });
    return;
  } catch (error) {
    throw error;
  }
}

// UPDATE Operations

const updateAccount = async (id, account) => {
  try {
    await Account.update({
      ...account
    }, {
      where: {
        id: id
      }
    });
    return;
  } catch (error) {
    throw error;
  }
}

// Delete Operations

const deleteAccount = async (id) => {
  try {
    await Account.destroy({
      where: {
        id: id
      }
    });
  } catch (error) {
    throw error;
  }
}


const authenticateUser = (user) => {
  return new Promise((resolve, reject) => {
    const statement = `SELECT id, password FROM UserData WHERE email = '${user.email}';`
    db.query(statement, (error, result) => {

      if (error) {
        reject({
          code: 400,
          message: error.sqlMessage
        });
      }

      if (!result) {
        reject({
          code: 404,
          message: 'User not found.'
        });
      }

      if (result) {
        resolve({
          code: 200,
          message: 'User found.',
          data: result[0]
        });
      }

    });
  });
}

module.exports = {
  generateAuthToken,
  createAccount,
  readAccount,
  updateAccount,
  deleteAccount,
  authenticateUser
}