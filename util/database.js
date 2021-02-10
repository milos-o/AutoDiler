const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('autodiler', 'root', process.env.DBPASS, {
  dialect: 'mysql',
  host: 'localhost',
  port: '3306'
});

module.exports = sequelize;
