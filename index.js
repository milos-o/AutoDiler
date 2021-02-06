const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const sequelize = require("./util/database");
const multer = require("multer");
const path = require("path");
const { json, urlencoded } = require("body-parser");

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

const User = require("./models/User");
const Model = require("./models/Model");
const Comment = require("./models/Comment");
const Category = require("./models/Category");
const Brand = require("./models/Brand");
const Advertisment = require("./models/Advertisment");
const userAdvertisment = require("./models/User-Advertisment");




const PORT = process.env.PORT || 3000;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

//Configure Session Storage
app.use(
  cookieSession({
    name: "session-name",
    keys: ["key1", "key2"],
  })
);

//Configure Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    User.findByPk(1)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use("/admin", adminRoutes);
app.use(userRoutes);



User.hasMany(Comment);
Comment.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.belongsToMany(Advertisment, { through: userAdvertisment });
Advertisment.belongsToMany(User, { through: userAdvertisment });
Category.hasMany(Advertisment);
Advertisment.belongsTo(Category);
Brand.hasMany(Advertisment);
Advertisment.belongsTo(Brand);
Brand.hasMany(Model);
Model.belongsTo(Brand);


sequelize
//  .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    console.log(user);
  })
  .then((cart) => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT} 🚀🔥`));
  })
  .catch((err) => {
    console.log(err);
  });
