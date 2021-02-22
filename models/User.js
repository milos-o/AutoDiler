const { BOOLEAN } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  phone:Sequelize.STRING,
  isAdmin: Sequelize.BOOLEAN
});

module.exports = User;
