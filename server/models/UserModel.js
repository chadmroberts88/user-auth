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

const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    userData.id = uuidv4();

    const fields = [];
    const values = [];
    Object.entries(userData).forEach((entry) => {
      const [key, value] = entry;
      fields.push(` ${key}`);
      values.push(` '${value}'`);
    });

    const statement = `INSERT INTO UserData (${fields}) VALUES (${values});`

    db.query(statement, (error, result) => {

      if (error) {
        reject({
          code: 400,
          message: error.sqlMessage
        });
      }

      if (result.affectedRows === 0) {
        reject({
          code: 400,
          message: 'User not created.'
        })
      }

      if (result.affectedRows !== 0) {
        resolve({
          code: 201,
          message: 'User created.',
          data: userData
        });
      }

    });
  });
}

const updateUserData = (id, userData) => {
  return new Promise((resolve, reject) => {

    const set = [];
    Object.entries(userData).forEach((entry) => {
      const [key, value] = entry;
      set.push(` ${key} = '${value}'`);
    });

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
          data: userData
        });
      }

    })

  });
}

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

      if (result && (result[0].password !== user.password)) {
        reject({
          code: 400,
          message: 'Passwords do not match.'
        });
      }

      if (result && (result[0].password === user.password)) {
        resolve({
          code: 200,
          message: 'Passwords match.',
          data: { id: result[0].id }
        });
      }

    });
  });
}

const getBest = (qty) => {
  return new Promise((resolve, reject) => {
    const statement = `SELECT username, best FROM UserData ORDER BY best DESC, username ASC LIMIT ${qty};`;
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
          message: 'No users found.'
        });
      }

      if (result) {
        resolve({
          code: 200,
          message: 'List retrieved.',
          data: result
        });
      }

    })
  });
}

const getUser = (id) => {
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
        result[0].rank = await getRank(result[0].username);
        resolve({
          code: 200,
          message: 'User data retrieved.',
          data: result[0]
        });
      }

    });

  });
}

const getRank = (username) => {
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

module.exports = {
  createUser,
  updateUserData,
  deleteUser,
  authenticateUser,
  getBest,
  getUser
}