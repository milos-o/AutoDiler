const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Model = sequelize.define('model', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true
  }
});

module.exports = Model;
