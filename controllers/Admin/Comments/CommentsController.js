const Comment = require("../../../models/Comment");
const { validationResult } = require("express-validator/check");

const postAddComment = async (req, res, next) => {
  const text = req.body.text;
  const advertismentId = req.body.advertismentId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
    const result = await req.user.createComment({
      text: text,
      advertismentId: advertismentId,
    });

    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postEditComment = async (req, res, next) => {
  const commentId = req.body.id;
  const updatedText = req.body.text;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const comment = await Comment.findByPk(commentId);
    comment.text = updatedText;
    comment.save();
    return res.status(200).json(comment);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll();
    return res.status(200).json(comments);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const postDeleteComment = async (req, res, next) => {
  const commentId = req.body.id;

  try {
    const comment = await Comment.findByPk(commentId);
    comment.destroy();
    return res.status(200).send("Deleted!");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  postAddComment,
  postEditComment,
  getAllComments,
  postDeleteComment,
};
