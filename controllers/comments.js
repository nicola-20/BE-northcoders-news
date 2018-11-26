const { Comment } = require('../models')

const getComments = (req, res, next) => {
  const sortField = req.query.sort
  const sortBy = req.query.by === 'asc' ? 1 : req.query.by === 'desc' ? -1 : 0
  let sort = {}
  sort[sortField] = sortBy
  const page = req.query.page || 1
  const itemsOnPage = parseInt(req.query.limit) || 10
  const itemsToSkip = itemsOnPage * (page - 1)
  Comment.find()
  .sort({[sortField]: sortBy})
  .limit(itemsOnPage).skip(itemsToSkip)
  .populate('belongs_to', 'title -_id')
  .populate('created_by', 'name username -_id')
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
    if (!comment) return Promise.reject({ status: 404, msg: `Comment not found for ID: ${comment_id}` })
    res.status(200).send({ comment })
  })
  .catch(next)
}

const getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params
  const sortField = req.query.sort
  const sortBy = req.query.by === 'asc' ? 1 : req.query.by === 'desc' ? -1 : 0
  let sort = {}
  sort[sortField] = sortBy
  const page = req.query.page || 1
  const itemsOnPage = parseInt(req.query.limit) || 10
  const itemsToSkip = itemsOnPage * (page - 1)
  Comment
  .find( { belongs_to: article_id } )
  .sort({[sortField]: sortBy})
  .limit(itemsOnPage).skip(itemsToSkip)
  .populate('belongs_to', 'title -_id')
  .populate('created_by', 'name -_id')
  .then((comments) => {
    if (!comments[0]) return Promise.reject({ status: 404, msg: `Comments not found for Article ID: ${article_id}` })
    res.status(200).send({ comments })
  })
  .catch(next)
}

const addCommentToArticle = (req, res, next) => {
  const { body, created_by } = req.body
  const { article_id } = req.params
  const comment = new Comment({ body, created_by, belongs_to: article_id })
  comment.save()
  .then(() => {
    return Comment.populate(comment, {path: 'belongs_to', select: 'title -_id'})
  })
  .then(() => {
    return Comment.populate(comment, {path: 'created_by', select: 'name -_id'})
  })
  .then((comment) => {
    res.status(201).send({ comment })
  })
  .catch(next)
}

const updateCommentVotes = (req, res, next) => {
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
  const { comment_id } = req.params
  Comment.findByIdAndRemove( comment_id )
  .then(() => {
    res.status(200).send({message: 'Comment was deleted'})
  })
  .catch(next)
}

module.exports = { getComments, getCommentsByArticleID, addCommentToArticle, getCommentByCommentID, updateCommentVotes, deleteComment }