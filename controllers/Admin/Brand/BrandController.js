const Brand = require("../../../models/Brand");
const Model = require("../../../models/Model");
const { validationResult } = require("express-validator/check");

const postAddBrand = async (req, res, next) => {
  const name = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
    const brand = await Brand.create({
      name: name,
    });
    return res.status(200).json(brand);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postEditBrand = async (req, res, next) => {
  const brandId = req.body.id;
  const updatedName = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const brand = await Brand.findByPk(brandId);
    brand.name = updatedName;
    brand.save();
    return res.status(200).json(brand);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.findAll();
    return res.status(200).json(brands);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postDeleteBrand = async (req, res, next) => {
  const brandId = req.body.id;

  try {
    const brand = await Brand.findByPk(brandId);
    brand.destroy();
    return res.status(200).send("Deleted!");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findOneBrand = async (req, res, next) => {
  const brandId = req.body.id;

  try {
    const result = await Brand.findOne({
      where: {
        id: brandId,
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
  postAddBrand,
  postEditBrand,
  getAllBrands,
  postDeleteBrand,
  findOneBrand,
};
