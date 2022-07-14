const mysql = require('mysql2');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

db.connect((error) => {
  if (error) throw error;
  console.log("UserModel connected to MySQL!");
});

// Generate JWT for User

const generateAuthToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_KEY);
}

// CREATE Operations

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    user.id = uuidv4();

    const fields = [];
    const values = [];
    for (let key in user) {
      fields.push(` ${key}`);
      values.push(` '${user[key]}'`);
    }

    const statement = `INSERT INTO UserData (${fields}) VALUES (${values});`;
    db.query(statement, (error, result) => {

      if (error) {
        reject({
          code: 400,
          message: error.sqlMessage
        });
      }

      if (!result) {
        reject({
          code: 400,
          message: 'User not created.'
        })
      }

      if (result) {
        resolve({
          code: 201,
          message: 'User created.',
          data: user
        });
      }

    });
  });
}

// READ Operations

const readUser = (id) => {
  return new Promise((resolve, reject) => {
    const statement = `SELECT * FROM UserData WHERE id = '${id}';`;
    db.query(statement, async (error, result) => {

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
        result[0].rank = await readRank(result[0].username);
        resolve({
          code: 200,
          message: 'User data retrieved.',
          data: result[0]
        });
      }

    });

  });
}

const readRank = (username) => {
  return new Promise((resolve, reject) => {
    const statement = `SELECT username, best FROM UserData ORDER BY best DESC, username ASC;`;
    db.query(statement, (error, result) => {

      if (error) {
        reject(error);
      }

      if (!result) {
        reject('No result.');
      }

      if (result) {
        resolve(result.map(object => object.username).indexOf(username));
      }

    });
  })
}

const readLeaders = (qty) => {
  return new Promise((resolve, reject) => {
    const statement = `SELECT username, best FROM UserData ORDER BY best DESC, username ASC LIMIT ${qty};`;
    db.query(statement, (error, result) => {

      if (error) {
        reject({
          code: 400,
          message: error.sqlMessage
        });
      }

      if (result.length === 0) {
        reject({
          code: 404,
          message: 'No users found.'
        });
      }

      if (result.length > 0) {
        resolve({
          code: 200,
          message: 'List retrieved.',
          data: result
        });
      }

    })
  });
}

// UPDATE Operations

const updateUser = (id, user) => {
  return new Promise((resolve, reject) => {

    const set = [];
    for (let key in user) {
      set.push(` ${key} = '${user[key]}'`);
    }

    const statement = `UPDATE UserData SET${set} WHERE id = '${id}';`;

    db.query(statement, (error, result) => {

      if (error) {
        reject({
          code: 400,
          message: error.sqlMessage
        });
      }

      if (result.affectedRows === 0) {
        reject({
          code: 404,
          message: 'User not found.'
        })
      }

      if (result.affectedRows !== 0) {
        resolve({
          code: 200,
          message: 'User data updated.',
          data: user
        });
      }

    })

  });
}

// DELETE Operations

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {

    const statement = `DELETE FROM UserData WHERE id = '${id}';`;

    db.query(statement, (error, result) => {

      if (error) {
        reject({
          code: 400,
          message: error.sqlMessage
        });
      }

      if (result.affectedRows === 0) {
        reject({
          code: 404,
          message: 'User not found.'
        })
      }

      if (result.affectedRows !== 0) {
        resolve({
          code: 200,
          message: 'User deleted.'
        });
      }

    })

  });
}

module.exports = {
  generateAuthToken,
  createUser,
  readUser,
  readLeaders,
  updateUser,
  deleteUser
}