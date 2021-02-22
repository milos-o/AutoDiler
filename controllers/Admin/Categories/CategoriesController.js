const Category = require("../../../models/Category");
const Model = require("../../../models/Model");
const { validationResult } = require("express-validator/check");

const postAddCategory = async (req, res, next) => {
  const name = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
    const result = await Category.create({
      name: name,
    });

    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postEditCategory = async (req, res, next) => {
  const categoryId = req.body.id;
  const updatedName = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
    const category = await Category.findByPk(categoryId);
    category.name = updatedName;
    category.save();
    return res.status(200).json(category);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postDeleteCategory = async (req, res, next) => {
  const categoryId = req.body.id;

  try {
    const category = await Category.findByPk(categoryId);
    category.destroy();
    return res.status(200).send("Deleted!");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findOneCategory = async (req, res, next) => {
  const categoryId = req.body.id;
  try {
    const result = await Category.findOne({
      where: {
        id: categoryId,
      },
      include: Model,
    });
    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  postAddCategory,
  postEditCategory,
  getAllCategories,
  postDeleteCategory,
  findOneCategory,
};
