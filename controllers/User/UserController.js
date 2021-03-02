const Advertisment = require("../../models/Advertisment");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const CarModel = require("../../models/Model");
const Brand = require("../../models/Brand");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("../../util/sendingMail");
const crypto = require("crypto");
const { Op, Model } = require("sequelize");
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
    const result = await Advertisment.findAll({
      where: {
        userId: req.user.id,
      },
      attributes:{exclude:["modelId","userId"]},
      include:[{
        model:CarModel,
        attributes: ["id","name"],
        include:{
            model:Brand,
            attributes: ["id","name"],
        }
    },
    /*{
      model:Images,
      required:true,
    },*/
  ],
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
    let images = req.files;
    let add = await Advertisment.create({
      title:req.body.title,
      description:req.body.description,
      fuel:req.body.fuel,
      cubic:req.body.cubicCapacity,
      mileage:req.body.mileage,
      kw:req.body.kw,
      transmission:req.body.transmission,
      year:req.body.year,
      userId: userId,
      modelId:req.body.model,

    })
    if (images) {
      images.forEach((image) => {
        Images.create({
          path: image.path,
          advertismentId: add.id,
        });
      });
    }
    res.status(201).json(add);
  } catch (error) {
    if(!error.statusCode) error.statusCode=400;
    next(error);
  }
}
  
async function editAdd(req,res,next){
  let id = req.params.addId;
  

  if(!id) next(new Error("Missing params! No id of add to be edited!!"));
  try {
    let add = await Advertisment.findByPk(id);

    if(add.userId!=req.user.id){
      let err = new Error("You dont have permissions for this action");
      err.statusCode = 401; 
      next(err);
    }

    if(req.body.title) add["title"]=req.body.title;
    if(req.body.transmission) add["transmission"]=req.body.transmission;
    if(req.body.fuel) add["fuel"]=req.body.fuel;
    if(req.body.mileage) add["mileage"]=req.body.mileage;
    if(req.body.kw) add["kw"]=req.body.kw;
    if(req.body.cubicCapacity) add["cubic"]=req.body.cubicCapacity;
    if(req.body.year) add["year"]=req.body.year;
    if(req.body.model) add["model"]=req.body.odel;
    if(req.body.description) add["description"]=req.body.description;

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

    if(add.userId!=req.user.id){
      let err = new Error("You dont have permissions for this action");
      err.statusCode = 401; 
      next(err);
    }
    add.destroy();
    res.status(200).json(`Add with id:${id} deleted`);
    

  } catch (error) {
      if(!error.statusCode){
        error.statusCode=400;
    }
    next(error);
  }
}
//comments

async function addComment(req,res,next){
  try {
    let advertismentId = req.params.addId;
    let userId=req.user.id;
    let comment = await Comment.create({
      text: req.body.text,
      userId: userId,
      advertismentId:advertismentId
    })
    res.status(201).json(comment);
  } catch (error) {
    if(!error.statusCode) error.statusCode=400;
    next(error);
  }  
}


async function deleteComment(res,req,next){
  let id = req.params.commentId;
  try {
    let comment = await Comment.findByPk(id);
    
    comment.destroy();
    res.status(200).json(`Comment with id:${id} deleted`);
  } catch (error) {
      if(!error.statusCode){
        error.statusCode=400;
    }
    next(error);
  }
}


module.exports = {
  logout,
  register,
  login,
  myAdvertisment,
  addNewAdd,
  editAdd,
  deleteAdd,
  addComment,
  deleteComment,
  verifyEmail,
  getResetPassword,
  getNewPassword,
  postNewPassword,
  loginSucceded,
};
