const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const sequelize = require("./util/database");
const { json, urlencoded } = require("body-parser");
app.use(urlencoded({ extended: true }));
app.use(json());

const User = require("./models/User");
//require('./passport/google-auth');

const app = express();

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

const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

app.use("/admin", adminRoutes);
app.use(userRoutes);

sequelize
  //.sync({ force: true })
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
