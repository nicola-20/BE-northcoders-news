const { Comment } = require('../models')

const getComments = (req, res, next) => {
  Comment.find()
  .populate('belongs_to', 'title -_id')
  .populate('created_by', 'name -_id')
  .then((comments) => {
    res.status(200).send({ comments })
  })
  .catch(next)
}

const getCommentByCommentID = (req, res, next) => {
  const { comment_id } = req.params
  Comment.findById(comment_id)
  .populate('belongs_to', 'title -_id')
  .populate('created_by', 'name -_id')
  .then((comment) => {
    res.status(200).send({ comment })
  })
  .catch(next)
}

const getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params
  Comment
  .find( { belongs_to: article_id } )
  .populate('belongs_to', 'title -_id')
  .populate('created_by', 'name -_id')
  .then((comments) => {
    res.status(200).send({ comments })
  })
  .catch(next)
}

const addCommentToArticle = (req, res, next) => {
  const { body, created_by } = req.body
  const { article_id } = req.params
  comment = new Comment({ body, created_by, belongs_to: article_id })
  comment.save()
  .then(() => {
    return Comment.populate(comment, {path: 'belongs_to', select: 'title -_id'})
  })
  .then(() => {
    return Comment.populate(comment, {path: 'created_by', select: 'name -_id'})
  })
  // comment.save()
  // .populate('belongs_to', 'title -_id')
  // .populate('created_by', 'name -_id')
  .then((comment) => {
    res.status(201).send({ comment })
  })
  .catch(next)
}

const updateCommentVotes = (req, res, next) => {
  // Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
  // e.g: `/api/comments/:comment_id?vote=down`
  const { comment_id } = req.params
  const { vote } = req.query
  const voteChange = vote === 'up' ? 1 : vote === 'down' ? -1 : 0
  Comment.findOneAndUpdate( { _id: comment_id }, { $inc: { votes: voteChange } }, { new: true } )
  .then((comment) => {
    res.send( { comment } )
  })
  .catch(next)
}

const deleteComment = (req, res, next) => {
  // Deletes a comment
  const { comment_id } = req.params
  Comment.findByIdAndRemove( comment_id )
  .then(() => {
    res.status(200).send({message: 'Comment was deleted'})
  })
  .catch(next)
}

module.exports = { getComments, getCommentsByArticleID, addCommentToArticle, getCommentByCommentID, updateCommentVotes, deleteComment }