const Advertisment = require("../../models/Advertisment");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const nodemailer = require("../../util/sendingMail");
const crypto = require('crypto');
const { Op } = require("sequelize");


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

const getResetPassword = async (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
   const token = buffer.toString('hex');
   const user = await User.findOne({ where: { email: email }});
      
   if (!user) {
       req.flash('error', 'No account with that email found.');
      return res.redirect('/reset');
    }
   user.resetToken = token;
   user.resetTokenExpiration = Date.now() + 3600000;
      
      
        transporter.sendMail({
          to: email,
          from: process.env.USER,
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        });
    
  });
}
const getNewPassword = async (req, res, next) => {
  const token = req.params.token;

try {
  const user = User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: {
        [Op.gt]: Date.now()
      }
    }
  });
  return res.status(200).json(user);

} catch (error) {
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
  const user = User.findOne({
    where: {
      resetToken: passwordToken,
      id: userId,
      resetTokenExpiration: {
        [Op.gt]: Date.now()
      }
    }
  });
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  return res.status(200).json(user);
} catch (error) {
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
  postNewPassword
};
