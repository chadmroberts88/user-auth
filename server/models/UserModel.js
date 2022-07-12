const mysql = require('mysql2');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

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

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    user.id = uuidv4();

    const statement = `INSERT INTO UserData (id, username, email, password, soundOn, darkModeOn, useSwipeOn, best) VALUES (
      '${user.id}',
      '${user.username}',
      '${user.email}',
      '${user.password}',
      '${user.soundOn}',
      '${user.darkModeOn}',
      '${user.useSwipeOn}',
      '${user.best}'
    );`

    db.query(statement, (error, result) => {

      if (error) {
        reject({
          code: 400,
          message: error.sqlMessage
        });
      }

      if (result) {
        resolve({
          code: 201,
          message: 'User created.'
        });
      }

    });
  });
}

const logInUser = (user) => {
  return new Promise((resolve, reject) => {
    const statement = `SELECT * FROM UserData WHERE email = '${user.email}';`
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
          message: 'User not found.'
        });
      }

      if (result.length > 0 && (result[0].password !== user.password)) {
        reject({
          code: 400,
          message: 'Passwords do not match.'
        });
      }

      if (result.length > 0 && (result[0].password === user.password)) {
        resolve({
          code: 200,
          message: 'Passwords match.',
          data: result
        });
      }

    });
  });
}

const updateUsername = (user) => {
  return new Promise((resolve, reject) => {
    const statement = `UPDATE UserData SET username = '${user.username}' WHERE email = '${user.email}';`;
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
          message: 'Username updated.'
        });
      }

    })
  });
}

const updatePassword = (user) => {
  return new Promise((resolve, reject) => {
    const statement = `UPDATE UserData SET password = '${user.password}' WHERE email = '${user.email}';`;
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
          message: 'Password updated.'
        });
      }

    })
  });
}

const updateEmail = (user) => {
  return new Promise((resolve, reject) => {
    const statement = `UPDATE UserData SET email = '${user.newEmail}' WHERE email = '${user.email}';`;
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
          message: 'Email updated.'
        });
      }

    })
  });
}

const updateSettings = (user) => {
  return new Promise((resolve, reject) => {

    const statement = `UPDATE UserData SET
      soundOn = '${user.soundOn}',
      darkModeOn = '${user.darkModeOn}',
      useSwipeOn = '${user.useSwipeOn}'
      WHERE email = '${user.email}';`;

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
          message: 'Settings updated.'
        });
      }

    })
  });
}



const getLeaderboardList = (qty) => {
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

const deleteUser = (user) => {
  return new Promise((resolve, reject) => {
    const statement = `DELETE FROM UserData WHERE email = '${user.email}';`;
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

const getUserRank = (user) => {

}

module.exports = {
  createUser,
  logInUser,
  updateUsername,
  updatePassword,
  updateEmail,
  updateSettings,
  getLeaderboardList,
  deleteUser,
  getUserRank
}