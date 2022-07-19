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

const generateAuthToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_KEY);
};

// CREATE Operations

const createAccount = async (user) => {

  try {
    const result = await db.transaction(async (trans) => {

      const account = await Account.create({
        email: user.email,
        password: user.email
      }, { transaction: trans });

      const profile = await account.createProfile({
        username: user.username,
        soundOn: user.soundOn,
        darkModeOn: user.darkModeOn,
        useSwipeOn: user.useSwipeOn,
        best: user.best,
        fileName: user.fileName,
        photo: user.photo
      }, { transaction: trans });

      const game = await account.createGame({
        score: user.score,
        multiplier: user.multiplier,
        tileIds: user.tileIds,
        tiles: user.tiles
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
          best: profile.best,
          fileName: profile.fileName,
          photo: profile.photo
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

const authenticateAccount = async (email) => {
  try {
    const result = await Account.findAll({
      where: {
        email: email
      }
    });

    console.log(result);

    return {
      id: result[0].id,
      password: result[0].password
    };
  } catch (error) {
    throw error;
  }
}

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




module.exports = {
  generateAuthToken,
  createAccount,
  readAccount,
  updateAccount,
  deleteAccount,
  authenticateAccount
}