const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Contact = sequelize.define('comment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type:Sequelize.STRING,
    allowNull:false
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
  
});

module.exports = Contact;
