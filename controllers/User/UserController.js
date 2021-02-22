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


//


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




``

  //need to be updated
async function addNewAdd(req,res,next){
  try {
    let userId=req.user.id;
    let add = await Advertisment.create({
      title:req.body.title,
      description:req.body.description,
      fuel:req.body.fuel,
      mileage:req.body.mileage,
      kw:req.body.kw,
      transmission:req.body.transmission,
      year:req.body.year,
      userId: userId,
      modelId:req.body.model,

    })
    res.status(203).json(add);
  } catch (error) {
    if(!error.statusCode) error.statusCode=400;
    next(error);
  }
}
  
async function editAdd(req,res,next){
  let id = req.params.addId;
  const {title,description,fuel,mileage,kw,cubicCapacity,year,model,transmission}=req.body;

  if(!id) next(new Error("Missing params! No id of add to be edited!!"));
  try {
    let add = await Advertisment.findByPk(id);
    if(add.userId!=req.user.id) next(new Error("You dont have premissions for this action"))
    if(title) add["title"]=title;
    if(transmission) add["transmission"]=transmission;
    if(fuel) add["fuel"]=fuel;
    if(mileage) add["mileage"]=mileage;
    if(kw) add["kw"]=kw;
    if(cubicCapacity) add["cubic"]=cubicCapacity;
    if(year) add["year"]=year;
    if(model) add["model"]=model;
    if(description) add["description"]=description;

    await add.save();
    await add.reload();
    res.status(200).json(add);
  } catch (error) {
      if(!error.statusCode){
        error.statusCode=400;
    }
    next(error);
  }
}


async function deleteAdd(req,res,next){
  let id = req.params.addId;
  try {
    let add = await Advertisment.findByPk(id);
    
    add.destroy();
    res.status(200).json(`Add with id:${id} deleted`);
  } catch (error) {
      if(!error.statusCode){
        error.statusCode=400;
    }
    next(error);
  }
}
//

module.exports = {
  logout,
  register,
  login,
  myAdvertisment,
  addNewAdd,
  editAdd,
  deleteAdd,
  verifyEmail,
  getResetPassword,
  getNewPassword,
  postNewPassword,
  loginSucceded
};
