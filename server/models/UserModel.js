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

    !user.soundOn ? user.soundOn = 0 : user.soundOn = 1;
    !user.darkModeOn ? user.darkModeOn = 0 : user.darkModeOn = 1;
    !user.useSwipeOn ? user.useSwipeOn = 0 : user.useSwipeOn = 1;

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
        })
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
          message: 'Passwords match.'
        });
      }

    });
  });
}

const updateUser = () => {

}

const deleteUser = () => {

}

const findUser = (user) => {
  return new Promise((resolve, reject) => {
    const statement = `SELECT * FROM UserData WHERE email = '${user.email}';`
    db.query(statement, (error, result) => {
      if (error || (result.length === 0)) {
        reject({
          message: error || 'User not found in database.'
        });
      }
      if (result.length > 0) {
        resolve({
          name: result[0].name,
          email: result[0].email
        });
      }
    });
  });
}

module.exports = {
  createUser,
  logInUser,
  findUser,
  updateUser,
  deleteUser
}