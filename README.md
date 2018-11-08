## Northcoders News API

https://stormy-river-98715.herokuapp.com/api/


### Getting Started

This is a 'Northcoders News' API using a northcoders_news database hosted on mLab, containing Topics, Users, Articles and Comments.

### Prerequisites

- Node.js
- MongoDB 

Dependencies:

```
body-parser: ^1.15.2
express: ^4.16.3
heroku: ^7.18.5
lodash: ^4.17.11
mongoose: ^5.3.10
```

Dev Dependencies:

```
chai: ^4.1.2,
mocha: ^5.0.5,
supertest: ^3.0.0,
nodemon: ^1.17.4
```

### Installing

1. Fork/clone the repository
  ```
  https://github.com/nicola-20/BE2-northcoders-news
  ```
2. Navigate into folder and install the dependencies
  ```
  npm install
  ```
3. Create a ```/config``` directory with an ```index.js``` file containing:
```
DB_URL
datapath
```
  Set these values for each environment; 'test', 'development' and 'production', and export them to be used elsewhere

  E.g.:
  ```
  exports.DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/northcoders_news_test' : 'mongodb://localhost:27017/northcoders_news'

exports.datapath = process.env.NODE_ENV === 'test' 
? 'testData' 
: 'devData'
  ```

4. Run ```mongod``` within a new terminal

5. To seed the database:
```
npm run seed:dev
```

6. To run the development server:
```
npm run dev
```

7. Navigate to the endpoints user a browser or Postman



### Running the Tests

1. Ensure you have installed all the dev dependencies.

2. Ensure you are running in a test environment, and using test data

3. Run  '``` npm test ```' to run the tests within the spec file



### Routes

Routes available within the api. For more information, see the API documentation.

```http
GET /api 
# Serves an HTML page with documentation for all the available endpoints
```

```http
GET /api/topics
# Get all the topics
```

```http
GET /api/topics/:topic_slug/articles
# Return all the articles for a certain topic
# e.g: `/api/topics/football/articles`
```

```http
POST /api/topics/:topic_slug/articles
# Add a new article to a topic. This route requires a JSON body with title and body key value pairs
# e.g: `{ "title": "new article", "body": "This is my new article content", "created_by": "user_id goes here"}`
```

```http
GET /api/users/
# e.g: `/api/users`
# Returns an array of all the User objects
```

```http
GET /api/users/:username
# e.g: `/api/users/mitch123`
# Returns a JSON object with the profile data for the specified user.
```

```http
GET /api/articles
# Returns all the articles
```

```http
GET /api/articles/:article_id
# Get an individual article
```

```http
PATCH /api/articles/:article_id
# Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
# e.g: `/api/articles/:article_id?vote=up`
```

```http
GET /api/articles/:article_id/comments
# Get all the comments for a individual article
```

```http
POST /api/articles/:article_id/comments
# Add a new comment to an article. This route requires a JSON body with body and created_by key value pairs
# e.g: `{"body": "This is my new comment", "created_by": "user_id goes here"}`
```
```http
GET /api/comments/
# Return all comments
```
```http
GET /api/comments/:comment_id
# Return a single comment by its ID
```

```http
PATCH /api/comments/:comment_id
# Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
# e.g: `/api/comments/:comment_id?vote=down`
```

```http
DELETE /api/comments/:comment_id
# Deletes a comment
```

### Deployment

To deploy this app, use mLab to host the database, then create the app within Heroku. Make sure to set your config for heroku before pushing.

### Built With:
- Node.js
- MongoDB
- Mongoose
- Express
- mLab
- Heroku
- Lodash

### Author

Nicola Derrick