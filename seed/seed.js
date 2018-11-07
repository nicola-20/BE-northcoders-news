const mongoose = require('mongoose');
const { Topic, User, Article, Comment } = require('../models')
const { formatArticles, formatComments } = require('../utils')

const seedDB = ({ topicData, userData, articleData, commentData }) => {
// seed topics and users
// seed articles - needs topics and users
// seed comments - needs users and articles
  console.log('Seeding the database..')
  return mongoose.connection.dropDatabase()
  .then(() => {
    console.log('Dropped the database')
    return Promise.all([
      Topic.insertMany(topicData),
      User.insertMany(userData)
    ])
  })
  .then(([ topicDocs, userDocs ]) => {
    console.log(`${topicDocs.length} documents added to 'topics'`)
    console.log(`${userDocs.length} documents added to 'users'`)
    return Promise.all([
      topicDocs, 
      userDocs,
      Article.insertMany(formatArticles(articleData, topicDocs, userDocs))
    ])
  })
  .then(([ topicDocs, userDocs, articleDocs ]) => {
    console.log(`${articleDocs.length} documents added to 'articles'`)
    return Promise.all([
      topicDocs, 
      userDocs, 
      articleDocs, 
      Comment.insertMany(formatComments(commentData, userDocs, articleDocs))
    ])
  })
  .then(([ topicDocs, userDocs, articleDocs, commentDocs ]) => {
    console.log(`${commentDocs.length} documents added to 'comments'`)
  })
  .catch(console.log)
}

module.exports = seedDB;