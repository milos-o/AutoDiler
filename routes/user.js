const express = require("express");
const passport = require("passport");
require("../passport/google-auth");
const UserController = require("../controllers/User/UserController");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { check, body } = require("express-validator/check");
const { isAdmin, isAuth } = require("../middleware/auth");

const router = express.Router();

const upload = require("../util/file-upload");
const multipleUpload = upload.any();

//Protected Route.
router.get("/profile", (req, res) => {
  res.send(`<h1>${req.user.displayName}'s Profile Page</h1>`);
});

// Auth Routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/profile");
  }
);

//Logout
router.get("/logout", UserController.logout);

router.get("/logSucces", UserController.loginSucceded);

router.post("/login", UserController.login);

router.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("name").isString(),
    body("location").isString(),
  ],
  UserController.register
);

router.get("/my-advertisment", UserController.myAdvertisment);

router.post("/advertisment",multipleUpload,UserController.addNewAdd);

router.put("/advertisment/:addId",UserController.editAdd);

router.delete("/advertisment/:addId",UserController.deleteAdd);

router.post("/comment/:addId",UserController.addComment);

router.delete("/comment/:commentId",UserController.deleteComment);

router.get("/confirm/:code", UserController.verifyEmail);

router.get("/reset/:token", UserController.getNewPassword);

router.post("/get-password-reset",  UserController.getResetPassword);

router.post("/new-password",  UserController.postNewPassword);

module.exports = router;

