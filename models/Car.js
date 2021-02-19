const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Car = sequelize.define('car', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  carbody: Sequelize.STRING,
  image: Sequelize.STRING,
  fuel: Sequelize.STRING,
  mielage: Sequelize.INTEGER,
  cubic: Sequelize.INTEGER,
  year: Sequelize.DATE,
  price: Sequelize.INTEGER,
  gearbox: Sequelize.STRING
});

module.exports = Car;
