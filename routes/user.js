const express = require("express");
const passport = require("passport");
require("../passport/google-auth");
//const { body, validationResult } = require("express-validator");
const UserController = require("../controllers/User/UserController");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { isAdmin, isAuth } = require("../middleware/auth");

const router = express.Router();

//Unprotected Routes
router.get("/", (req, res) => {
  res.send("<h1>Home</h1>");
});

router.get("/failed", (req, res) => {
  res.send("<h1>Log in Failed :(</h1>");
});

// Middleware - Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

//Protected Route.
router.get("/profile", checkUserLoggedIn, (req, res) => {
  res.send(`<h1>${req.user.displayName}'s Profile Page</h1>`);
});

// Auth Routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/profile");
  }
);

//Logout
router.get("/logout", UserController.logout);

router.get("/logSucces", (req, res) => {
  res.status(200).send("Loged in succesfully!!");
});

router.post("/login", UserController.login);

router.post("/register", UserController.register);

router.get("/my-advertisment", UserController.myAdvertisment);

router.get("/confirmation/:code", UserController.verifyEmail);

module.exports = router;
