const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('autodiler', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  port: '3308'
});

module.exports = sequelize;
