## Northcoders News API

https://nd-be-news.herokuapp.com/ 


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
  ```js
  npm install
  ```
3. Create a ```/config``` directory with an ```index.js``` file containing:
```js
DB_URL
datapath
```
  Set these values for each environment; 'test', 'development' and 'production', and export them to be used elsewhere

  E.g.:
  ```js
  exports.DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/northcoders_news_test' : 'mongodb://localhost:27017/northcoders_news'

exports.datapath = process.env.NODE_ENV === 'test' 
? 'testData' 
: 'devData'
  ```

4. Run ```mongod``` within a new terminal

5. To seed the database:
```js
npm run seed:dev
```

6. To run the development server:
```js
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

# Has functionality to sort using a query
# e.g: `/api/topics?sort=title&by=asc`

# Displays in pages which can be set using a query (defaults to view first page and display 10 items per page)
# e.g: `/api/topics?limit=10&page=1`
```

```http
GET /api/topics/:topic_slug/articles
# Return all the articles for a certain topic
# e.g: `/api/topics/football/articles`

# Has functionality to sort using a query
# e.g: `/api/topics/coding/articles?sort=votes&by=desc`

# Displays in pages - which can be set using a query (defaults to view first page and display 10 items per page)
# e.g: `/api/topics/football/articles?limit=20&page=2`
# e.g: `/api/topics/coding/articles?sort=votes&by=desc&limit=10&page=3`
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

# Has functionality to sort using a query
# e.g: `/api/users?sort=username&by=asc`

# Displays in pages which can be set using a query (defaults to view first page and display 10 items per page)
# e.g: `/api/users?limit=3&page=1`
```

```http
GET /api/users/:username
# e.g: `/api/users/mitch123`
# Returns a JSON object with the profile data for the specified user.
```

```http
GET /api/articles
# Returns all the articles

# Has functionality to sort using a query
# e.g: `/api/articles?sort=created_at&by=desc`

# Displays in pages which can be set using a query (defaults to view first page and display 10 items per page)
# e.g: `/api/articles?limit=10`
# e.g: `/api/articles?sort=created_at&by=desc&limit=5&page=2`
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

# Has functionality to sort using a query
# e.g: `/api/articles/:article_id/comments?sort=created_at&by=asc`

# Displays in pages which can be set using a query (defaults to view first page and display 10 items per page)
# e.g: `/api/articles/:article_id/comments?limit=10&page=3`
```

```http
POST /api/articles/:article_id/comments
# Add a new comment to an article. This route requires a JSON body with body and created_by key value pairs
# e.g: `{"body": "This is my new comment", "created_by": "user_id goes here"}`
```
```http
GET /api/comments/
# Return all comments

# Has functionality to sort using a query
# e.g: `/api/comments?sort=created_at&by=desc`
# e.g: `/api/comments?sort=votes&by=asc`

# Displays in pages which can be set using a query (defaults to view first page and display 10 items per page)
# e.g: `/api/comments?limit=100`
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