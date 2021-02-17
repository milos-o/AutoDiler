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
  name: {
   type: Sequelize.STRING,
   allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: Sequelize.STRING,
  isAdmin: {
   type: Sequelize.BOOLEAN,
   defaultValue: false
  },
  verificationToken: {
    type: Sequelize.STRING,
  },
  emailVerified:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  resetToken: String,
  resetTokenExpiration: Date
});

module.exports = User;
