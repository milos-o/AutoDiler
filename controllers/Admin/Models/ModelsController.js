const Brand = require("../../../models/Brand");
const Category = require("../../../models/Category");
const Model = require("../../../models/Model");
const { validationResult } = require('express-validator/check');

const postAddModel = (req, res, next) => {
  const name = req.body.name;
  const brandId = req.body.brandId;
  const categoryId = req.body.categoryId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

    Model.create({
      name: name,
      brandId: brandId,
      categoryId: categoryId
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const postEditModel = (req, res, next) => {
  const modelId = req.body.id;
  const updatedName = req.body.name;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  Model.findByPk(modelId)
    .then((model) => {
      model.name = updatedName;
      return model.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

const getAllModels = (req, res, next) => {
  Model.findAll({
    include: [
      {
        model: Brand
      },
      {
        model: Category
      }
    ]
  })
    .then((models) => {
      res.status(200).json(models);
    })
    .catch((err) => console.log(err));
};

const postDeleteModel = (req, res, next) => {
  const modelId = req.body.id;
  Model.findByPk(modelId)
    .then((model) => {
      return model.destroy();
    })
    .then((result) => {
      res.status(200).send("Deleted!");
    })
    .catch((err) => console.log(err));
};

module.exports = {
  postAddModel,
  postEditModel,
  getAllModels,
  postDeleteModel,
};
