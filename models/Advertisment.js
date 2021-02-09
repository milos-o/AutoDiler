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
  carbody: Sequelize.STRING,
  image: Sequelize.STRING,
  fuel: Sequelize.STRING,
  mielage: Sequelize.INTEGER,
  cubic: Sequelize.INTEGER,
  year: Sequelize.DATE
});


module.exports = Advertisment;
