const Sequelize = require('sequelize');
require('dotenv').config();
/*
const sequelize = new Sequelize(process.env.RDS_DBNAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  dialect: 'mysql',
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT
});*/
const sequelize = new Sequelize('autodiler', 'root', process.env.DBPASS, {
  dialect: 'mysql',
  host: 'localhost',
  port: '3306'
});


module.exports = sequelize;


