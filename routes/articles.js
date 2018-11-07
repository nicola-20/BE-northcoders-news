const articlesRouter = require("express").Router();
const { getArticles, getArticleByArticleID, updateArticleVotes } = require('../controllers/articles')
const { getCommentsByArticleID, addCommentToArticle } = require('../controllers/comments')

articlesRouter.route('')
  .get(getArticles)

articlesRouter.route('/:article_id')
  .get(getArticleByArticleID)
  .patch(updateArticleVotes)

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleID)
  .post(addCommentToArticle)


module.exports = articlesRouter;