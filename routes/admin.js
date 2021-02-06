const express = require("express");
const adminComments = require("../controllers/Admin/Comments/CommentsController");
const adminCategories = require("../controllers/Admin/Categories/CategoriesController");
const adminBrands = require("../controllers/Admin/Brand/BrandController");
const adminModels = require("../controllers/Admin/Models/ModelsController");

const router = express.Router();

// routes for comments begin
router.post("/create-comment", adminComments.postAddComment);

router.post("/edit-comment", adminComments.postEditComment);

router.delete("/delete-comment", adminComments.postDeleteComment);

router.get("/all-comments", adminComments.getAllComments);
// routes for comments end

// routes for categorys begin
router.post("/create-category", adminCategories.postAddCategory);

router.post("/edit-category", adminCategories.postEditCategory);

router.delete("/delete-category", adminCategories.postDeleteCategory);

router.get("/all-categories", adminCategories.getAllCategories);

router.get("/category", adminCategories.findOneCategory);
// routes for categorys end

// routes for brands begin
router.post("/create-brand", adminBrands.postAddBrand);

router.post("/edit-brand", adminBrands.postEditBrand);

router.delete("/delete-brand", adminBrands.postDeleteBrand);

router.get("/all-brands", adminBrands.getAllBrands);

router.get("/brand", adminBrands.findOneBrand);
// routes for brands end

// routes for models begin
router.post("/create-model", adminModels.postAddModel);

router.post("/edit-model", adminModels.postEditModel);

router.delete("/delete-model", adminModels.postDeleteModel);

router.get("/all-models", adminModels.getAllModels);
// routes for models end

module.exports = router;
