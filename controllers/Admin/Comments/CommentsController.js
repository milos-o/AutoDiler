const Comment = require('../../../models/Comment');


const postAddComment = (req, res, next) => {
  const text = req.body.text;

  req.user
    .createComment({
      text: text,
    })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
    });
};

const postEditComment = (req, res, next) => {
  const commentId = req.body.id;
  const updatedText = req.body.text;
  
  Comment.findByPk(commentId)
    .then(comment => {
      comment.text = updatedText;
      return comment.save();
    })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => console.log(err));
};

const getAllComments = (req, res, next) => {
  
    Comment.findAll()
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => console.log(err));
};

const postDeleteComment = (req, res, next) => {
  const commentId = req.body.id;
  Comment.findByPk(commentId)
    .then(comment => {
      return comment.destroy();
    })
    .then(result => {
      res.status(200).send("Deleted!");
    })
    .catch(err => console.log(err));
};

module.exports = {
    postAddComment,
    postEditComment,
    getAllComments,
    postDeleteComment
}