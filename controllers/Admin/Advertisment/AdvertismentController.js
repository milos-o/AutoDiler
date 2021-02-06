const Advertisment = require("../../../models/Advertisment");
const userAdvertisment = require("../../../models/User-Advertisment");
const Model = require("../../../models/Model");
const User = require("../../../models/User");

const postAddAdvertisment = async (req, res, next) => {
  const name = req.body.name;
  const fuel = req.body.fuel;
  const carbody = req.body.carbody;
  const year = req.body.year;
  const mielage = req.body.mielage;

  const oglas = await req.user.createAdvertisment({
    name: name,
  });
  console.log(oglas);

  const result = await Promise.all([
    User.create(),
    Advertisment.create(),
  ]).then(([user, advertisment]) =>
    userAdvertisment.create({
      userId: req.user.id,
      advertismentId: advertisment.id,
      fuel: fuel,
      carbody: carbody,
      year: year,
      mielage: mielage,
    })
  );

  return res.status(200).json(result);
};

const postEditAdvertisment = (req, res, next) => {
  const categoryId = req.body.id;
  const updatedName = req.body.name;

  Category.findByPk(categoryId)
    .then((category) => {
      category.name = updatedName;
      return category.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

const getAllAdvertisment = async (req, res, next) => {
  const result = await userAdvertisment.findAll({
    //   include: [User]
  });
  
  return res.status(200).json(result);
};

const postDeleteAdvertisment = async (req, res, next) => {
  const advertismentId = req.body.id;
  const record = await userAdvertisment.findByPk(advertismentId);
  console.log(record);
  const result = await record.destroy();
  return res.status(200).send("Success");
  
};

const findOneAdvertisment = async (req, res, next) => {
  const categoryId = req.body.id;
  const result = await Category.findOne({
    where: {
      id: categoryId,
    },
    include: Model,
  });
  return res.status(200).json(result);
};

module.exports = {
  postAddAdvertisment,
  postEditAdvertisment,
  getAllAdvertisment,
  postDeleteAdvertisment,
  findOneAdvertisment,
};
