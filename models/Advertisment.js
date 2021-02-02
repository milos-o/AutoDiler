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
  email: Sequelize.STRING
});

module.exports = Advertisment;
