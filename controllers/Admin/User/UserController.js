const { validationResult } = require('express-validator/check');
const User = require("../../../models/User");
const bcrypt = require("bcrypt");

const postAddUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const location = req.body.location;
  const password = bcrypt.hashSync(req.body.password, 8);
  const isAdmin = req.body.isAdmin;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
   const user = await User.create({
      name: name,
      email: email,
      password: password,
      location: location,
      isAdmin: isAdmin
    })
    return  res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postEditUser = async (req, res, next) => {
  const userId = req.body.id;
  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  const updatedLocation = req.body.location;
  const updatedPassword = bcrypt.hashSync(req.body.password, 8);
  const updatedRole = req.body.isAdmin;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
    const user = await User.findByPk(userId);
      user.name = updatedName;
      user.email = updatedEmail;
      user.location = updatedLocation;
      user.password = updatedPassword;
      user.isAdmin = updatedRole;
      user.save();
      res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {

  try {
   const users = await User.findAll();
     return res.status(200).json(users);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postDeleteUser = async (req, res, next) => {
  const userId = req.body.id;
  try {
    const user = await User.findByPk(userId);
    user.destroy();
    return res.status(200).send("Deleted!");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

async function singleUser(req,res,next){
  try {
    let id = req.params.userId;
    const users = await User.findByPk(id);
      return res.status(200).json(users);
   } catch (err) {
     if (!err.statusCode) {
       err.statusCode = 500;
     }
     next(err);
   }
}

module.exports = {
  postAddUser,
  postEditUser,
  getAllUsers,
  postDeleteUser,
  singleUser
};