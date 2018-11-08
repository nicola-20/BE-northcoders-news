const { Article, Comment } = require('../models')

const addCommentCount = (article) => {
  return Comment.countDocuments({ belongs_to: article._id })
  .then((numComments) => {
    const { _id, title, body, created_by, votes, created_at, belongs_to } = article
    return { _id, title, body, created_by, votes, created_at, belongs_to, comment_count: numComments }
    // article.comment_count = numComments ????
  })
}

const getArticles = (req, res, next) => {
  const sortField = req.query.sort
  const sortBy = req.query.by === 'asc' ? 1 : req.query.by === 'desc' ? -1 : 0
  let sort = {}
  sort[sortField] = sortBy
  return Article.find()
  .sort({[sortField]: sortBy})
  .populate('created_by', 'username name -_id')
  .then((articles) => {
    return Promise.all(articles.map(addCommentCount))
  })
  .then(( articles ) => {
    res.status(200).send({ articles })
  })
  .catch(next)
}

const getArticleByArticleID = (req, res, next) => {
  const { article_id } = req.params
  Article.findById(article_id)
  .populate('created_by', 'username name -_id')
  .then((article) => {
    if (!article) return Promise.reject({ status: 404, msg: `Article not found for ID: ${article_id}` })
    else return addCommentCount(article)
  })
  .then((article) => {
    res.status(200).send({ article })
  })
  .catch(next)
}

const updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params
  const { vote } = req.query
  const voteChange = vote === 'up' ? 1 : vote === 'down' ? -1 : 0
  Article.findOneAndUpdate( { _id: article_id }, { $inc: { votes: voteChange } }, { new: true } )
  .then((article) => {
    if(!vote) {
      return Promise.reject({ status: 400, msg: `"${Object.keys(req.query)[0]}" is not a valid query` })
    }
    if (voteChange === 0) {
      return Promise.reject({ status: 400, msg: `"${vote}" is not a valid value for this query` })
    }
    res.send( { article } )
  })
  .catch(next)
}

const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params
  const sortField = req.query.sort
  const sortBy = req.query.by === 'asc' ? 1 : req.query.by === 'desc' ? -1 : 0
  let sort = {}
  sort[sortField] = sortBy
  Article.find( { belongs_to: topic_slug } )
  .sort({[sortField]: sortBy})
  .populate('created_by', 'username name -_id')
  .then((articles) => {
    return Promise.all(articles.map(addCommentCount))
  })
  .then(( articles ) => {
    res.status(200).send({ articles })
  })
  .catch(next)
}

const addArticle = (req, res, next) => {
  const { topic_slug } = req.params
  const { title, body, created_by } = req.body
  article = new Article({ title, body, created_by, belongs_to: topic_slug })
  article.save()
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 400, msg: `"${req.body}" is not a valid article` })
      }
      res.status(201).send({ article })
    })
  .catch(next)
}

module.exports = { getArticles, getArticleByArticleID, updateArticleVotes, getArticlesByTopic, addArticle }