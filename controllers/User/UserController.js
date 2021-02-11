const Advertisment = require("../../models/Advertisment");
const User = require("../../models/User");

const logout = (req, res, next) => {
  req.session = null;
  req.logout();
  res.status(200).send("You are logged out.");
};

const register = (req, res, next) => {
  const { username, email, password, role } = req.body;

  User.findOne({ email: email }).exec((err, user) => {
    console.log(user);
    if (user) {
      errors.push({ msg: "email already registered" });
      res.render("register", { errors, name, email, password, password2 });
    } else {
      const newUser = new User({
        username: username,
        email: email,
        password: password,
        role: role,
      });

      //hash password
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          //save pass to hash
          newUser.password = hash;
          //save user
          newUser
            .save()
            .then((value) => {
              res.redirect("/login");
            })
            .catch((value) => console.log(value));
        })
      );
    }
  });
};

const login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/logSucces",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

//


const myAdvertisment = async (req, res, next) => {
  const result = await User.findOne({
    where: {
      id: req.user.id,
    },
    include: Advertisment,
  });
  return res.status(200).json(result);
}

//need to be updated
async function addNewAdd(req,res,next){
  try {
    let userId=req.user.id;
    let add = await Advertisment.create({
      name:req.body.name,
      carbody:req.body.carbody,
      fuel:req.body.fuel,
      mielage:req.body.mileage,
      userId: userId,
      modelId:req.body.model
    })
    res.status(203).json(add);
  } catch (error) {
    if(!error.statusCode) error.statusCode=400;
    next(error);
  }
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
  addNewAdd
};
