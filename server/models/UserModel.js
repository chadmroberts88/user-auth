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
  console.log("MySQL Connected!");
})

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    user.id = uuidv4();
    const statement = `INSERT INTO UserData (id, name, email, password) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}');`
    db.query(statement, (error, result) => {

      if (error) {
        reject({
          status: 'error',
          details: error
        })
      } else {
        resolve({
          status: 'ok',
          details: result
        });
      }

    });
  });
}

const readUser = (user) => {
  return new Promise((resolve, reject) => {
    const statement = `SELECT * FROM UserData WHERE email = '${user.email}';`
    db.query(statement, (error, result) => {

      if (error) {
        reject({
          status: 'error',
          details: error
        })
      } else if (result.length > 0) {
        if (result[0].password === user.password) {
          resolve({
            status: 'email found. passwords match.',
            details: result
          });
        } else {
          resolve({
            status: 'email found. passwords DO NOT match.',
          });
        }
      } else {
        resolve({
          status: 'email NOT found',
        });
      }

    });

  });
}

const updateUser = () => {

}

const deleteUser = () => {

}

module.exports = {
  createUser,
  readUser,
  updateUser,
  deleteUser
}