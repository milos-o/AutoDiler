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

module.exports = {
  logout,
  register,
  login,
};
