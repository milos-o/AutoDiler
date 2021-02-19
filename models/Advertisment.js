const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Advertisment = sequelize.define('advertisment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  carbody: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fuel: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mielage: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  cubic: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  year: {
    type: Sequelize.DATE,
    allowNull: false
  },
});

module.exports = Advertisment;
