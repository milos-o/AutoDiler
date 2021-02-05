const Comment = require('../models/Comment');


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

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findById(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

const postEditComment = (req, res, next) => {
  const commentId = req.body.commentId;
  const updatedText = req.body.text;
  
  Product.findById(commentId)
    .then(comment => {
      comment.text = updatedText;
      return comment.save();
    })
    .then(result => {
      
      res.status(200).send("Success");
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
    getEditProduct,
    postEditComment,
    getAllComments,
    postDeleteComment
}