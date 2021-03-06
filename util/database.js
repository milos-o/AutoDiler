const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.RDS_DBNAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  dialect: 'mysql',
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT
});


module.exports = sequelize;


