const { Topic } = require('../models')

const getTopics = (req, res, next) => {
  const sortField = req.query.sort
  const sortBy = req.query.by === 'asc' ? 1 : req.query.by === 'desc' ? -1 : 0
  let sort = {}
  sort[sortField] = sortBy
  Topic.find().sort({[sortField]: sortBy})
  .then((topics) => {
    res.status(200).send({ topics })
  })
  .catch(next)
}

module.exports = { getTopics }