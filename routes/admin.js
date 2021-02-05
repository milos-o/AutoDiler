const express = require("express");
const adminComments = require("../controllers/Admin/Comments/CommentsController");
const adminCategories = require("../controllers/Admin/Categories/CategoriesController");
//const adminComments = require("../controllers/Admin/Comments/CommentsController");
//const adminComments = require("../controllers/Admin/Comments/CommentsController");


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
// routes for categorys end



module.exports = router;
