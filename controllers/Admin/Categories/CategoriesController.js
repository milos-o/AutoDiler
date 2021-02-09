const Category = require("../../../models/Category");
const Model = require("../../../models/Model");

const postAddCategory = async (req, res, next) => {
  const name = req.body.name;

  const result = await Category.create({
    name: name,
  });

  return res.status(200).json(result);
};

const postEditCategory = (req, res, next) => {
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

const getAllCategories = (req, res, next) => {
  Category.findAll()
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => console.log(err));
};

const postDeleteCategory = (req, res, next) => {
  const categoryId = req.body.id;
  Category.findByPk(categoryId)
    .then((category) => {
      return category.destroy();
    })
    .then((result) => {
      res.status(200).send("Deleted!");
    })
    .catch((err) => console.log(err));
};

const findOneCategory = async (req, res, next) => {
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
  postAddCategory,
  postEditCategory,
  getAllCategories,
  postDeleteCategory,
  findOneCategory,
};
