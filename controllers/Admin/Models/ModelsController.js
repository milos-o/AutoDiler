const Model = require("../../../models/Model");

const postAddModel = (req, res, next) => {
  const name = req.body.name;
  const brandId = req.body.id;

  
    Model.create({
      name: name,
      brandId: brandId
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
  Model.findAll()
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
