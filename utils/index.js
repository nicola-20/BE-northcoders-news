const _ = require('lodash')

const formatArticles = (articleData, topicDocs, userDocs) => {
  return articleData.map((article) => {
    return {
      ...article,
      votes: Math.floor(Math.random() * 100) + 1,
      // belongs_to: _.find(topicDocs, (topic) => {return topic.slug === article.topic}, 0).slug,
      belongs_to: topicDocs.find((topic) => {return topic.slug === article.topic}).title,
      created_by: _.sample(userDocs)._id
      // [Math.floor(Math.random() * (userDocs.length)) + 1]
    }
  })
}

const formatComments = (commentData, userDocs, articleDocs) => {
  return commentData.map((comment) => {
    return {
      ...comment,
      // belongs_to: _.find(articleDocs, (article) => {return article.title === comment.belongs_to}, 0)._id,
      belongs_to: articleDocs.find(article => {return article.title === comment.belongs_to})._id,
      created_by: _.sample(userDocs)._id
    }
  })
}

module.exports = { formatArticles, formatComments }