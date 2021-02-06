const Brand = require("../../../models/Brand");
const Model = require("../../../models/Model");

const postAddBrand = (req, res, next) => {
  const name = req.body.name;

  
    Brand.create({
      name: name,
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const postEditBrand = (req, res, next) => {
  const brandId = req.body.id;
  const updatedName = req.body.name;

  Brand.findByPk(brandId)
    .then((brand) => {
      brand.name = updatedName;
      return brand.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

const getAllBrands = (req, res, next) => {
  Brand.findAll()
    .then((brands) => {
      res.status(200).json(brands);
    })
    .catch((err) => console.log(err));
};

const postDeleteBrand = (req, res, next) => {
  const brandId = req.body.id;
  Brand.findByPk(brandId)
    .then((brand) => {
      return brand.destroy();
    })
    .then((result) => {
      res.status(200).send("Deleted!");
    })
    .catch((err) => console.log(err));
};

const findOneBrand = async (req, res, next) => {
  const brandId = req.body.id;
  const result = await Brand.findOne({
    where: {
      id: brandId,
    },
    include: Model,
  });
  return res.status(200).json(result);
};

module.exports = {
  postAddBrand,
  postEditBrand,
  getAllBrands,
  postDeleteBrand,
  findOneBrand
};
