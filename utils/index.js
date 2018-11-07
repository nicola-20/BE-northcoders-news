const _ = require('lodash')

const formatArticles = (articleData, topicDocs, userDocs) => {
  // title, body, votes, created_at, belongs_to, created_by
  return articleData.map((article) => {
    return {
      ...article,
      votes: Math.floor(Math.random() * 100) + 1,
      belongs_to: _.find(topicDocs, (topic) => {return topic.slug === article.topic}, 0).slug,
      created_by: _.sample(userDocs)._id
    }
  })
}

const formatComments = (commentData, userDocs, articleDocs) => {
  //body, votes, created_at, belongs_to, created_by
  return commentData.map((comment) => {
    return {
      ... comment,
      belongs_to: _.find(articleDocs, (article) => {return article.title === comment.belongs_to}, 0)._id,
      created_by: _.sample(userDocs)._id
    }
  })
}

module.exports = { formatArticles, formatComments }