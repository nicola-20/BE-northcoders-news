const { Topic } = require('../models')

const getTopics = (req, res, next) => {
  const sortField = req.query.sort
  const sortBy = req.query.by === 'asc' ? 1 : req.query.by === 'desc' ? -1 : 0
  let sort = {}
  sort[sortField] = sortBy
  const page = req.query.page || 1
  const itemsOnPage = parseInt(req.query.limit) || 10
  const itemsToSkip = itemsOnPage * (page - 1)
  Topic.find()
  .sort({[sortField]: sortBy})
  .limit(itemsOnPage).skip(itemsToSkip)
  .then((topics) => {
    res.status(200).send({ topics })
  })
  .catch(next)
}

module.exports = { getTopics }