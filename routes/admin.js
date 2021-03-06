const express = require("express");
const { check, body } = require("express-validator/check");

const adminCategories = require("../controllers/Admin/Categories/CategoriesController");
const adminBrands = require("../controllers/Admin/Brand/BrandController");
const adminModels = require("../controllers/Admin/Models/ModelsController");
const adminAdvertisment = require("../controllers/Admin/Advertisment/AdvertismentController");
const adminComments = require("../controllers/Admin/Comments/CommentsController");
const adminContact = require("../controllers/Admin/Contact/ContactController");
const adminUsers = require("../controllers/Admin/User/UserController");

const router = express.Router();

const upload = require("../util/file-upload");
const multipleUpload = upload.any();

// routes for categorys begin
router.post(
  "/create-category",
  [body("name").isString().isLength({ min: 3 })],
  adminCategories.postAddCategory
);

router.post(
  "/edit-category",
  [body("name").isString().isLength({ min: 3 })],
  adminCategories.postEditCategory
);

router.delete("/delete-category", adminCategories.postDeleteCategory);

router.get("/all-categories", adminCategories.getAllCategories);

router.get("/category", adminCategories.findOneCategory);
// routes for categorys end

// routes for brands begin
router.post(
  "/create-brand",
  [body("name").isString().isLength({ min: 3 })],
  adminBrands.postAddBrand
);

router.post(
  "/edit-brand",
  [body("name").isString().isLength({ min: 3 })],
  adminBrands.postEditBrand
);

router.delete("/delete-brand", adminBrands.postDeleteBrand);

router.get("/all-brands", adminBrands.getAllBrands);

router.get("/brand", adminBrands.findOneBrand);
// routes for brands end

// routes for models begin
router.post(
  "/create-model",
  [body("name").isString().isLength({ min: 3 })],
  adminModels.postAddModel
);

router.post(
  "/edit-model",
  [body("name").isString().isLength({ min: 3 })],
  adminModels.postEditModel
);

router.delete("/delete-model", adminModels.postDeleteModel);

router.get("/all-models", adminModels.getAllModels);
// routes for models end
//upload.array('photos', 12)

// routes for advertisments begin
router.post(
  "/create-advertisment",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("carbody").isString().trim(),
    body("transmission").isString(),
    body("mileage").isNumeric(),
    body("cubic").isNumeric(),
    body("kw").isNumeric(),
    body("year").isDate(),
    body("fuel")
      .isString()
      .withMessage("Gorivo moze biti samo dizel, benzin, metan ili elektricno.")
      .custom((value, { req }) => {
        if (
          value === "dizel" ||
          value === "benzin" ||
          value === "metan" ||
          value === "elektricno"
        ) {
          return true;
        }
        throw new Error();
      }),
  ],
  multipleUpload,
  adminAdvertisment.postAddAdvertisment
);

router.post(
  "/edit-advertisment",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("carbody").isString().trim(),
    body("transmission").isString(),
    body("mileage").isNumeric(),
    body("cubic").isNumeric(),
    body("kw").isNumeric(),
    body("year").isDate(),
    body("fuel")
      .isString()
      .withMessage("Gorivo moze biti samo dizel, benzin, metan ili elektricno.")
      .custom((value, { req }) => {
        if (
          value === "dizel" ||
          value === "benzin" ||
          value === "metan" ||
          value === "elektricno"
        ) {
          return true;
        }
        throw new Error();
      }),
  ],
  adminAdvertisment.postEditAdvertisment
);

router.delete("/delete-advertisment", adminAdvertisment.postDeleteAdvertisment);

router.get("/all-advertisment", adminAdvertisment.getAllAdvertisment);

router.get(
  "/advertisment-comments",
  adminAdvertisment.findAllCommentsForAdvertisment
);

router.get("/advertisment/:id", adminAdvertisment.findOneAdvertisment);

router.get("/search", adminAdvertisment.searchForAdvertisment);
// routes for advertisments end

// routes for comments begin
router.post(
  "/create-comment",
  [body("text").isString().isLength({ min: 3, max: 255 })],
  adminComments.postAddComment
);

router.post(
  "/edit-comment",
  [body("text").isString().isLength({ min: 3, max: 255 })],
  adminComments.postEditComment
);

router.delete("/delete-comment", adminComments.postDeleteComment);

router.get("/all-comments", adminComments.getAllComments);

router.get("/messages", adminContact.getContactForms);
router.delete("/message/:messageId", adminContact.deleteContactForm);

// routes for comments end

router.get("/auth-user", (req, res, next) => {
  console.log(req.user);
  return res.status(200).json(req.user);
});

// routes for users begin
router.post(
  "/create-user",
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
  adminUsers.postAddUser
);

router.post(
  "/edit-user",
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
  adminUsers.postEditUser
);

router.get("/all-users", adminUsers.getAllUsers);

router.delete("/delete-user", adminUsers.postDeleteUser);
// routes for users end

module.exports = router;
