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
}

// const getArticleByArticleID = (req, res, next) => {
//   const { article_id } = req.params
//   Article.findById(article_id)
//   .populate('created_by', 'username name -_id')
//   .then((article) => {
//     article.comment_count
//     res.status(200).send({ article })
//   })
// }

// const getArticleByArticleID = (req, res, next) => {
//   const { article_id } = req.params
//   return Promise.all([
//     Article.findById(article_id).populate('created_by', 'username name -_id'),
//     Comment.countDocuments( { belongs_to: article_id } )
//   ])
//   .then(([article, numComments]) => {
//     const { _id, title, body, created_by, votes, created_at, belongs_to } = article
//     return { _id, title, body, created_by, votes, created_at, belongs_to, comment_count: numComments }
//   })
//   .then((article) => {
//     res.status(200).send({ article })
//   })
// }

const getArticleByArticleID = (req, res, next) => {
  const { article_id } = req.params
  Article.findById(article_id)
  .populate('created_by', 'username name -_id')
  .then((article) => {
    return addCommentCount(article)
  })
  .then((article) => {
    res.status(200).send({ article })
  })
}

const updateArticleVotes = (req, res, next) => {
  // Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
  // e.g: `/api/articles/:article_id?vote=up`
  // PATCH 
  const { article_id } = req.params
  const { vote } = req.query
  const voteChange = vote === 'up' ? 1 : vote === 'down' ? -1 : 0
  Article.findOneAndUpdate( { _id: article_id }, { $inc: { votes: voteChange } }, { new: true } )
  .then((article) => {
    console.log(article)
    res.send( { article } )
  })
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
}

const addArticle = (req, res, next) => {
  const { topic_slug } = req.params
  const { title, body, created_by } = req.body
  article = new Article({ title, body, created_by, belongs_to: topic_slug })
  article.save()
    .then((article) => {
      res.send({ article })
    })
}

module.exports = { getArticles, getArticleByArticleID, updateArticleVotes, getArticlesByTopic, addArticle }