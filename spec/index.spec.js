process.env.NODE_ENV = 'test'
const app = require('../app');
const { expect } = require('chai')
const supertest = require('supertest')
const request = supertest(app)
const mongoose = require('mongoose')
const seedDB = require('../seed/seed')
const testData = require('../seed/testData')

//API
describe('/api', () => {

  let topicDocs, userDocs, articleDocs, commentDocs
  const wrongID = mongoose.Types.ObjectId();

  beforeEach(() => {
    return seedDB(testData)
      .then((docs) => {
        [ topicDocs, userDocs, articleDocs, commentDocs ] = docs
      })
  })

  after(() => {
    mongoose.disconnect()
  });

  // TOPICS
  describe('/topics', () => {

    it('GET - returns status 200 and array of all the topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).to.equal(topicDocs.length)
          expect(topics[0].title).to.equal(topicDocs[0].title)
          expect(topics[1].slug).to.equal(topicDocs[1].slug)
        })
    });
    describe('/topics/:topic_slug/articles', () => {
      it('GET - returns status 200 and array of all articles for relevant topic', () => {
        return request 
          .get(`/api/topics/${topicDocs[0].slug}/articles`)
          .expect(200)
          .then(( { body: { articles } } ) => {
            expect(articles.length).to.equal(articleDocs.filter((article) => {
              return article.belongs_to === topicDocs[0].slug
            }).length)
            expect(articles[0].belongs_to).to.equal(topicDocs[0].slug)
            expect(articles[1].belongs_to).to.equal(topicDocs[0].slug)
          })
      });
      it('POST - returns status 201 and new posted article', () => {
        const postedArticle = {
          "title": "new article",
          "body": "This is my new article content",
          "created_by": `${userDocs[0]._id}`
        }
        return request
          .post(`/api/topics/${topicDocs[0].slug}/articles`)
          .send(postedArticle)
          .expect(201)
          .then(( { body: { article } } ) => {
            expect(article.title).to.equal(postedArticle.title)
            expect(Object.keys(article)).to.eql(['votes', '_id', 'title', 'body', 'created_by', 'belongs_to', 'created_at', '__v'])
          })
      });
    });

  });


  // USERS
  describe('/users', () => {

    it('GET - returns status 200 and array of all the users', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).to.equal(userDocs.length)
          expect(users[0].username).to.equal(userDocs[0].username)
        })
    });
    describe('/users/:username', () => {
      it('GET - returns status 200 and the required user file ', () => {
        return request
          .get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(( { body: { user } } ) => {
            expect(user.username).to.equal(userDocs[0].username)
            expect(user.name).to.equal(userDocs[0].name)
          })
      });
    });

  });

  // ARTICLES
  describe('/articles', () => {

    it('GET - returns status 200 and array of all the articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(articleDocs.length)
          expect(articles[0].title).to.equal(articleDocs[0].title)
        })
    });

    describe('articles/:article_id', () => {
      it('GET - returns status 200 and the requested article', () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(( { body: { article } } ) => {
            expect(article.title).to.equal(articleDocs[0].title)
          })
      });
      it('PATCH - Returns status 200 and the updated article with votes incremented up', () => {
        return request
          .patch(`/api/articles/${articleDocs[1]._id}?vote=up`)
          .expect(200)
          .then(( { body: { article } } ) => {
            expect(article.votes).to.equal(articleDocs[1].votes + 1)
            expect(article.title).to.equal(articleDocs[1].title)
          })
      });
      it('PATCH - Returns status 200 and the updated article with votes incremented down', () => {
        return request
          .patch(`/api/articles/${articleDocs[1]._id}?vote=down`)
          .expect(200)
          .then(( { body: { article } } ) => {
            expect(article.votes).to.equal(articleDocs[1].votes - 1)
            expect(article.title).to.equal(articleDocs[1].title)
          })
      });
      // it('ERR GET - returns status 400 for an invalid ID', () => {
      //   return request
      //     .get(`/api/articles/123`)
      //     .expect(400)
      //     .then((res) => {
      //       expect(res.body.msg).to.equal('Cast to ObjectId failed for value "123" at path "_id" for model "articles"')
      //     })
      // });
      // it('GET - returns status 404 for a valid mongo ID that does not exist', () => {
      //   return request
      //     .get(`/api/articles/${wrongID}`)
      //     .expect(404)
      //     .then((res) => {
      //       expect(res.body.msg).to.equal(`Article not found for ID: ${wrongID}`)
      //     })
      // });

    });
    describe('/articles/:article_id/comments', () => {
      it('GET - returns status 200 and array of all the comments for the required article', () => {
        return request
        .get(`/api/articles/${articleDocs[1]._id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).to.equal(commentDocs.filter((comment) => {
            return comment.belongs_to === articleDocs[1]._id
          }).length)
          expect(comments[0].votes).to.equal(commentDocs.filter((comment) => {
            return comment.belongs_to === articleDocs[1]._id
          })[0].votes)
        })
      });
      it('POST - returns status 201 and posted comment, adds comment to article', () => {
        const postedComment = {
          "body": "This is my new comment", 
          "created_by": `${userDocs[1]._id}`
        }
        return request
          .post(`/api/articles/${articleDocs[1]._id}/comments`)
          .send(postedComment)
          .expect(201)
          .then(( { body: { comment } } ) => {
            expect(comment.body).to.equal(postedComment.body)
            expect(comment.votes).to.equal(0)
            expect(Object.keys(comment)).to.eql(['votes', '_id', 'body', 'created_by', 'belongs_to', 'created_at', '__v'])
          })
      });
    });

  });
  

  // COMMENTS
  describe('/comments', () => {

    it('GET - returns status 200 and array of all the comments', () => {
      return request
      .get(`/api/comments`)
      .expect(200)
      .then(( { body: { comments } } ) => {
        expect(comments.length).to.equal(commentDocs.length)
        expect(comments[0].body).to.equal(commentDocs[0].body)
      })
    });

    describe('/comments/:comment_id', () => {
      it('GET - Returns status 200 and the requested comment', () => {
        return request
        .get(`/api/comments/${commentDocs[2]._id}`)
        .expect(200)
        .then(( { body: { comment } } ) => {
          expect(comment.body).to.equal(commentDocs[2].body)
          expect(Object.keys(comment)).to.eql(['votes', '_id', 'body',  'belongs_to', 'created_by', 'created_at', '__v'])
        })
      });
      it('PATCH - returns status 200 and the updated comment with votes incremented up by 1', () => {
        return request
          .patch(`/api/comments/${commentDocs[2]._id}?vote=up`)
          .expect(200)
          .then(( { body: { comment } } ) => {
            expect(comment.votes).to.equal(commentDocs[2].votes + 1)
            expect(comment.body).to.equal(commentDocs[2].body)
          })
      });
      it('PATCH - returns status 200 and the updated comment with votes incremented down by 1', () => {
        return request
          .patch(`/api/comments/${commentDocs[2]._id}?vote=down`)
          .expect(200)
          .then(( { body: { comment } } ) => {
            expect(comment.votes).to.equal(commentDocs[2].votes - 1)
            expect(comment.body).to.equal(commentDocs[2].body)
          })
      });
      it('DELETE - returns status', () => {
        const postedComment = {
          "body": "This is my new comment", 
          "created_by": `${userDocs[1]._id}`
        }
        return request
          .post(`/api/articles/${articleDocs[1]._id}/comments`)
          .send(postedComment)
          .then(( { body: { comment } } ) => {
            expect(comment.body).to.equal(postedComment.body)
          })
        .then(() => {
          return request
          .delete(`/api/comments/${comment._id}`)
            .then(( { body } ) => {
              expect(body.message).to.equal('Comment was deleted')
            })
        })
      });
    });

  });

  // ERROR HANDLING
  xdescribe('errors', () => {
    it('', () => {
      
    });
  });

});

// 400 Bad request /api/topics/banana - expecting mongo_id
// 404 Not found /api/topics/sbdhf3990rbd (mongo id) but not in our collection 
