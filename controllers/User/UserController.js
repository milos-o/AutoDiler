const Advertisment = require("../../models/Advertisment");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const nodemailer = require("../../util/sendingMail");
//const { where } = require("sequelize");

const logout = (req, res, next) => {
  req.session = null;
  req.logout();
  res.status(200).send("You are logged out.");
};

const register = (req, res, next) => {
  const { username, email, password, isAdmin, confirmed } = req.body;
  const token = jwt.sign({email: req.body.email}, process.env.SECRET)
  
  const user = User.create({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 8),
    isAdmin: isAdmin,
    confirmed: token
  });
  console.log(token);
  nodemailer.sendConfirmationEmail(username, email, confirmed);

};

const login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/logSucces",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

const verifyEmail = async (req, res, next) => {
  token = req.params.code;
 
  try {
    const user = await User.findOne({
      where: {
        verificationToken: token,
      }
    });
    
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    user.emailVerified = true;
    return res.status(200).json(user);
    
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  
}

const myAdvertisment = async (req, res, next) => {
  const result = await User.findOne({
    where: {
      id: req.user.id,
    },
    include: Advertisment,
  });
  return res.status(200).json(result);
}
/*
const deleteAdvertisment = async (req, res, next) => {
  const result = await User.findOne({
    where: {
      id: req.user.id,
    },
    include: Advertisment,
  });

  return res.status(200).json(result);
}
*/
module.exports = {
  logout,
  register,
  login,
  myAdvertisment,
  verifyEmail
};
