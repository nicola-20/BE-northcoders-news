const { Topic } = require('../models')

const getTopics = (req, res, next) => {
  Topic.find()
  .then((topics) => {
    res.status(200).send({ topics })
  })
}

module.exports = { getTopics }