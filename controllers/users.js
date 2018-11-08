const { User } = require('../models')

const getUsers = (req, res, next) => {
  User.find()
  .then((users) => {
    res.status(200).send({ users })
  })
  .catch(next)
}

const getUserByUsername = (req, res, next) => {
  const { username } = req.params
  User.findOne( { username: username } )
  .then((user) => {
    if (!user) return Promise.reject({ status: 404, msg: `User not found with username ${username}` })
    res.status(200).send({ user })
  })
  .catch(next)
}

module.exports = { getUsers, getUserByUsername }