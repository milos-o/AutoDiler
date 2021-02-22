const Brand = require("../../../models/Brand");
const Category = require("../../../models/Category");
const Model = require("../../../models/Model");
const { validationResult } = require('express-validator/check');

const postAddModel = async (req, res, next) => {
  const name = req.body.name;
  const brandId = req.body.brandId;
  const categoryId = req.body.categoryId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
   const model = await Model.create({
      name: name,
      brandId: brandId,
      categoryId: categoryId
    })
    return  res.status(200).json(model);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postEditModel = async (req, res, next) => {
  const modelId = req.body.id;
  const updatedName = req.body.name;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
    const model = await Model.findByPk(modelId);
      model.name = updatedName;
      model.save();
      res.status(200).json(model);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getAllModels = async (req, res, next) => {

  try {
   const models = await Model.findAll({
      include: [
        {
          model: Brand
        },
        {
          model: Category
        }
      ]
    })
     return res.status(200).json(models);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postDeleteModel = async (req, res, next) => {
  const modelId = req.body.id;
  try {
    const model = await Model.findByPk(modelId);
    model.destroy();
    return res.status(200).send("Deleted!");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  postAddModel,
  postEditModel,
  getAllModels,
  postDeleteModel,
};
