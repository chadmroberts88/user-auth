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

// ------ CREATE Operations ------

/*
Handled by AccountModel
*/

// ------ READ Operations ------

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

const readProfile = async (accountId) => {
  try {
    const result = await Profile.findAll({
      where: {
        account_id: accountId
      }
    });

    const rank = await readRank(accountId);

    return {
      username: result[0].username,
      soundOn: result[0].soundOn,
      darkModeOn: result[0].darkModeOn,
      useSwipeOn: result[0].useSwipeOn,
      best: result[0].best,
      rank: rank
    };
  } catch (error) {
    return error;
  }
}

const readLeaders = async (offset, limit) => {
  try {
    const { count, rows } = await Profile.findAndCountAll({
      attributes: ['username', 'best'],
      order: [['best', 'DESC'], ['username', 'ASC']],
      offset: offset,
      limit: limit
    });

    const leaders = rows.map((object) => {
      return {
        username: object.username,
        best: object.best
      }
    });

    return {
      numRecords: count,
      leaders: leaders
    };

  } catch (error) {
    throw error;
  }
}

// ------ UPDATE Operations ------

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

// ------ DELETE Operations ------
/*
Handled by AccountModel
*/

module.exports = {
  Profile,
  readProfile,
  readRank,
  readLeaders,
  updateProfile
}