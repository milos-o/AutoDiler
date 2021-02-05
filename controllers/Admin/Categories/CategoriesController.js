const Category = require("../../../models/Category");

const postAddCategory = (req, res, next) => {
  const text = req.body.text;

  req.user
    .createCategory({
      text: text,
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
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

module.exports = {
  postAddCategory,
  postEditCategory,
  getAllCategories,
  postDeleteCategory,
};
