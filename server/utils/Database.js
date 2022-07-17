const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const db = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

module.exports = db;

