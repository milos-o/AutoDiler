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
  description: Sequelize.TEXT,
  fuel: Sequelize.STRING,
  mileage: Sequelize.INTEGER,
  kw:Sequelize.INTEGER,
  cubic: Sequelize.INTEGER,
  year: Sequelize.INTEGER,
  transmission:Sequelize.STRING
});


module.exports = Advertisment;
