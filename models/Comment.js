const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Car = sequelize.define('car', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  
});

module.exports = Car;
