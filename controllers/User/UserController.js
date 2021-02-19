const Advertisment = require("../../models/Advertisment");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("../../util/sendingMail");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { validationResult } = require('express-validator/check');

const logout = (req, res, next) => {
  req.session = null;
  req.logout();
  res.status(200).send("You are logged out.");
};

const register = (req, res, next) => {
  const { name, email, password, isAdmin, confirmed, location } = req.body;
  const token = jwt.sign({ email: req.body.email }, process.env.SECRET);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const user = User.create({
    name: name,
    email: email,
    password: bcrypt.hashSync(password, 8),
    isAdmin: isAdmin,
    confirmed: token,
    location: location
  });
  console.log(token);
  nodemailer.sendConfirmationEmail(name, email, confirmed);
};

const login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/logSucces",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

const loginSucceded = (req, res, next) => {
 // return res.status(200).send("Great, you are loged in");
  return res.status(200).json(req.user);
}

const verifyEmail = async (req, res, next) => {
  token = req.params.code;

  try {
    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
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
};

const myAdvertisment = async (req, res, next) => {
  try {
    const result = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: Advertisment,
    });
    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getResetPassword = async (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
  });

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).send("User with this email does not exist.");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;

    transporter.sendMail({
      to: email,
      from: process.env.USER,
      subject: "Password reset",
      html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
    });

    return res.status(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getNewPassword = async (req, res, next) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
    });
    return res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  try {
    const user = await User.findOne({
      where: {
        resetToken: passwordToken,
        id: userId,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
    });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    return res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

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
  verifyEmail,
  getResetPassword,
  getNewPassword,
  postNewPassword,
  loginSucceded
};
