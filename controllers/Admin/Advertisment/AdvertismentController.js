const Advertisment = require("../../../models/Advertisment");
const Category = require("../../../models/Category");
const Brand = require("../../../models/Brand");
const Model = require("../../../models/Model");
const User = require("../../../models/User");
const Comment = require("../../../models/Comment");
const Images = require("../../../models/Images");

const postAddAdvertisment = async (req, res, next) => {
  const name = req.body.name;
  const fuel = req.body.fuel;
  const carbody = req.body.carbody;
  const year = req.body.year;
  const mielage = req.body.mielage;
  const brandId = req.body.brandId;
  const categoryId = req.body.categoryId;
  const images = req.files;
  console.log(images);
  images.forEach((image) => {
    Images.create({
      path: image.path,
      advertismentId: 1,
    });
  });

  try {
    const result = await Advertisment.create({
      userId: req.user.id,
      fuel: fuel,
      carbody: carbody,
      year: year,
      mielage: mielage,
      brandId: brandId,
      categoryId: categoryId,
    });

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
  const updatedName = req.body.name;
  const updatedFuel = req.body.fuel;
  const updatedCarbody = req.body.carbody;
  const updatedYear = req.body.year;
  const updatedMielage = req.body.mielage;
  const updatedBrand = req.body.brandId;
  const updatedCategory = req.body.categoryId;

  Advertisment.findByPk(adverismentId)
    .then((advertisment) => {
      advertisment.name = updatedName;
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
          model: Brand,
          required: true,
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
  const advertismentId = req.body.id;

  try {
    const result = await Advertisment.findOne({
      where: {
        id: advertismentId,
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

module.exports = {
  postAddAdvertisment,
  postEditAdvertisment,
  getAllAdvertisment,
  postDeleteAdvertisment,
  findOneAdvertisment,
  findAllCommentsForAdvertisment,
};
