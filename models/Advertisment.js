const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Advertisment = sequelize.define('advertisment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description:  {
    type: Sequelize.TEXT,
  },
  kw:  {
    type: Sequelize.STRING,
    allowNull: false
  },
  transmission: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fuel: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mileage: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price:{
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
