const express = require("express");
const adminCategories = require("../controllers/Admin/Categories/CategoriesController");
const adminBrands = require("../controllers/Admin/Brand/BrandController");
const adminModels = require("../controllers/Admin/Models/ModelsController");
const adminAdvertisment = require("../controllers/Admin/Advertisment/AdvertismentController");
const adminComments = require("../controllers/Admin/Comments/CommentsController");

const router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'images/' })
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
//upload.array('photos', 12)

// routes for advertisments begin
router.post("/create-advertisment",  upload.any(), adminAdvertisment.postAddAdvertisment);

router.post("/edit-advertisment", adminAdvertisment.postEditAdvertisment);

router.delete("/delete-advertisment", adminAdvertisment.postDeleteAdvertisment);

router.get("/all-advertisment", adminAdvertisment.getAllAdvertisment);

router.get("/advertisment-comments", adminAdvertisment.findAllCommentsForAdvertisment);
// routes for advertisments end


// routes for comments begin
router.post("/create-comment", adminComments.postAddComment);

router.post("/edit-comment", adminComments.postEditComment);

router.delete("/delete-comment", adminComments.postDeleteComment);

router.get("/all-comments", adminComments.getAllComments);

// routes for comments end



module.exports = router;
