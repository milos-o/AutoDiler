const express = require('express');
const sequelize = require('./util/database');
const { json, urlencoded } = require("body-parser");
app.use(urlencoded({ extended: true }));
app.use(json());

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;


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

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);


sequelize
 //.sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
     console.log(user);
    //return user.createCart();
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


app.listen(PORT);