
/*export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  User.associate = (models) => {
    // 1 to many with board
    User.hasMany(models.Advertisment, {
      foreignKey: 'owner',
    });
    // 1 to many with suggestion
    User.hasMany(models.Comment, {
      foreignKey: 'creatorId',
    });
  };

  return User;
};
*/

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
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  isAdmin: Sequelize.BOOLEAN,
  verificationToken: {
    type: Sequelize.STRING,
    defaultValue: false,
  },
  emailVerified:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User;
