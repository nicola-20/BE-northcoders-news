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
  return Article.find().populate('created_by', 'username name -_id')
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
    if (!article) return Promise.reject({ status: 404, msg: 'Article not found...' })
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
    res.send( { article } )
  })
  .catch(next)
}

const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params
  Article.find( { belongs_to: topic_slug } )
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
      res.status(201).send({ article })
    })
  .catch(next)
}

module.exports = { getArticles, getArticleByArticleID, updateArticleVotes, getArticlesByTopic, addArticle }