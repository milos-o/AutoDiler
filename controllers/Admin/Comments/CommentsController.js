const Comment = require("../../../models/Comment");

const postAddComment = async (req, res, next) => {
  const text = req.body.text;
  const advertismentId = req.body.advertismentId;

  const result = await req.user.createComment({
    text: text,
    advertismentId: advertismentId,
  });

  return res.status(200).json(result);
};

const postEditComment = (req, res, next) => {
  const commentId = req.body.id;
  const updatedText = req.body.text;

  Comment.findByPk(commentId)
    .then((comment) => {
      comment.text = updatedText;
      return comment.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

const getAllComments = (req, res, next) => {
  Comment.findAll()
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => console.log(err));
};

const postDeleteComment = (req, res, next) => {
  const commentId = req.body.id;
  Comment.findByPk(commentId)
    .then((comment) => {
      return comment.destroy();
    })
    .then((result) => {
      res.status(200).send("Deleted!");
    })
    .catch((err) => console.log(err));
};

module.exports = {
  postAddComment,
  postEditComment,
  getAllComments,
  postDeleteComment,
};
