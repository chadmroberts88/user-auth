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
  console.log("GameModel connected to MySQL!");
});

const createGame = () => {
  return new Promise((resolve, reject) => {
    resolve('resolved');
    reject('rejected');
  });
};

const readGame = () => {
  return new Promise((resolve, reject) => {
    resolve('resolved');
    reject('rejected');
  });
};

const updateGame = () => {
  return new Promise((resolve, reject) => {
    resolve('resolved');
    reject('rejected');
  });
};

const deleteGame = () => {
  return new Promise((resolve, reject) => {
    resolve('resolved');
    reject('rejected');
  });
};

module.exports = {
  createGame,
  readGame,
  updateGame,
  deleteGame
}