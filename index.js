const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const sequelize = require("./util/database");
const multer = require("multer");
const path = require("path");
const helmet = require("helmet");
require('./passport/passport.js')(passport)
const { json, urlencoded } = require("body-parser");
const flash = require('connect-flash');
const cors = require("cors")


const app = express();

app.use(helmet());
app.use(cors())

app.use(urlencoded({ extended: true }));
app.use(json());

const User = require("./models/User");
const Images = require("./models/Images");
const Model = require("./models/Model");
const Comment = require("./models/Comment");
const Category = require("./models/Category");
const Brand = require("./models/Brand");
const Advertisment = require("./models/Advertisment");
const Contact = require("./models/Contact");


const PORT = process.env.PORT || 3000;

app.use("/images", express.static(path.join(__dirname, "images")));

//Configure Session Storage
app.use(
  cookieSession({
    name: "session-name",
    keys: ["key1", "key2"],
  })
);

app.use(flash());
//Configure Passport
app.use(passport.initialize());
app.use(passport.session());
 
const publicRoutes = require("./routes/public");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(publicRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.get("/", (req, res , next) => {
  return res.send("Hello amazon!");
})

User.hasMany(Advertisment);
Advertisment.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Comment);
Comment.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Advertisment.hasMany(Comment);
Comment.belongsTo(Advertisment, { constraints: true, onDelete: 'CASCADE' });
Category.hasMany(Model);
Model.belongsTo(Category);
Brand.hasMany(Model);
Model.belongsTo(Brand);
Model.hasMany(Advertisment);
Advertisment.belongsTo(Model);
Advertisment.hasMany(Images);
Images.belongsTo(Advertisment);


sequelize
  //.sync({ force: true })
  .sync()
  .then((user) => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT} 🚀🔥`));
  })
  .catch((err) => {
    console.log(err);
  });
