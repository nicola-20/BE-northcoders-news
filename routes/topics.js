const topicsRouter = require("express").Router();
const { getTopics } = require('../controllers/topics')
const { getArticlesByTopic, addArticle } = require('../controllers/articles')

topicsRouter.route('')
  .get(getTopics)

topicsRouter.route('/:topic_slug/articles')
  .get(getArticlesByTopic)
  .post(addArticle)


module.exports = topicsRouter;