const Advertisment = require("../../../models/Advertisment");
const Category = require("../../../models/Category");
const Brand = require("../../../models/Brand");
const Model = require("../../../models/Model");
const User = require("../../../models/User");
const Comment = require("../../../models/Comment");
const Images = require("../../../models/Images");
const { mode } = require("crypto-js");
const { Op } = require("sequelize");
const { validationResult } = require('express-validator/check');

const postAddAdvertisment = async (req, res, next) => {
  const title = req.body.title;
  const fuel = req.body.fuel;
  const description = req.body.description;
  const year = req.body.year;
  const mileage = req.body.mileage;
  const cubic = req.body.cubic;
  const kw = req.body.kw;
  const transmission = req.body.transmission;
  const modelId = req.body.modelId;
  const categoryId = req.body.categoryId;

  const images = req.files;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  let userId = 10;
  try {
    const result = await Advertisment.create({
      userId: userId,
      title:title,
      transmission:transmission,
      fuel: fuel,
      description:description,
      year: year,
      mileage: mileage,
      cubic: cubic,
      kw: kw,
      modelId: modelId,
      categoryId: categoryId,
    });

    if (images) {
      images.forEach((image) => {
        Images.create({
          path: image.location,
          advertismentId: result.id,
        });
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postEditAdvertisment = (req, res, next) => {
  const adverismentId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedFuel = req.body.fuel;
  const updatedDescription = req.body.description;
  const updatedKw = req.body.kw;
  const updatedTransmision = req.body.transmission;
  const updatedYear = req.body.year;
  const updatedMileage = req.body.mileage;
  const updatedModel = req.body.modelId;
  const updatedCategory = req.body.categoryId
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  Advertisment.findByPk(adverismentId)
    .then((advertisment) => {
      advertisment.title = updatedTitle;
      advertisment.transmission = updatedTransmision;
      advertisment.kw=updatedKw;
      advertisment.fuel = updatedFuel;
      advertisment.description = updatedDescription;
      advertisment.year = updatedYear;
      advertisment.mileage = updatedMileage;
      advertisment.categoryId = updatedCategory;
      advertisment.modelId = updatedModel;

      return advertisment.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

const getAllAdvertisment = async (req, res, next) => {
  try {
    const result = await Advertisment.findAll({
      include: [
        {
          model: User,
          required: true,
        },
        {
          model: Model,
          required: true,
          include:{
            model:Brand,
            required:true,
          }

        },
        {
          model: Category,
          required: true,
        },
      ],
    });

    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postDeleteAdvertisment = async (req, res, next) => {
  const advertismentId = req.body.id;
  try {
    const record = await Advertisment.findByPk(advertismentId);
    const result = await record.destroy();
    return res.status(200).send("Success");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findOneAdvertisment = async (req, res, next) => {
  const advertismentId = req.params.id;

  try {
    const result = await Advertisment.findOne({
      where: {
        id: advertismentId,
      },
      include: [
        {
          model: Model,
          include: [
            {
              model: Brand,
            },
            {
              model: Category,
            },
          ],
        },
      ],
    });
    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findAllCommentsForAdvertisment = async (req, res, next) => {
  const advertismentId = req.body.id;
  try {
    const result = await Advertisment.findOne({
      where: {
        id: advertismentId,
      },
      include: Comment,
    });
    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const searchForAdvertisment = async (req, res, next) => {
  const query = req.body.query;

  try {
    const result = await Advertisment.findAll({
      where: {
        [Op.or]: [
          {
            id: {
              [Op.like]: query,
            },
          },
          {
            name: {
              [Op.like]: query,
            },
          },
          {
            mileage: {
              [Op.like]: query,
            },
          },
          {
            fuel: {
              [Op.like]: query,
            },
          },
          {
            cubic: {
              [Op.like]: query,
            },
          },
        ],
      },
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
  postAddAdvertisment,
  postEditAdvertisment,
  getAllAdvertisment,
  postDeleteAdvertisment,
  findOneAdvertisment,
  findAllCommentsForAdvertisment,
  searchForAdvertisment,
};
