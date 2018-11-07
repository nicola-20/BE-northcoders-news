const commentsRouter = require("express").Router();
const { getComments, getCommentByCommentID, updateCommentVotes, deleteComment } = require('../controllers/comments')

commentsRouter.route('')
  .get(getComments)

commentsRouter.route('/:comment_id')
  .get(getCommentByCommentID)
  .patch(updateCommentVotes)
  .delete(deleteComment)

module.exports = commentsRouter;