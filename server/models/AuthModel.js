const mysql = require('mysql2');
const dotenv = require('dotenv');

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
  console.log("AuthModel connected to MySQL!");
});

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
  authenticateUser
}