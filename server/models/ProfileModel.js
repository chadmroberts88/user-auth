const Sequelize = require('sequelize');
const db = require('../utils/Database');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const Profile = db.define('Profiles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  soundOn: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  darkModeOn: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  useSwipeOn: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  best: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  account_id: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  }
});

// READ Operations

const readProfile = async (accountId) => {
  try {
    await Profile.findAll({
      where: {
        account_id: accountId
      }
    });
    return;
  } catch (error) {
    return error;
  }
}

const readRank = async (accountId) => {
  try {
    const result = await Profile.findAll({
      attributes: ['account_id'],
      order: [['best', 'DESC'], ['username', 'ASC']]
    });
    const rank = result.map(object => object.account_id).indexOf(accountId) + 1;
    return rank;
  } catch (error) {
    throw error;
  }
}

const readLeaders = async () => {
  try {
    const result = await Profile.findAll({
      attributes: ['username', 'best'],
      order: [['best', 'DESC'], ['username', 'ASC']]
    });

    const leaders = result.map((object) => {
      return {
        username: object.username,
        best: object.best
      }
    });

    return leaders;
  } catch (error) {
    throw error;
  }
}

// UPDATE Operations

const updateProfile = async (accountId, profile) => {
  try {
    await Profile.update({
      ...profile
    }, {
      where: {
        account_id: accountId
      }
    });
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  Profile,
  readProfile,
  readRank,
  readLeaders,
  updateProfile
}