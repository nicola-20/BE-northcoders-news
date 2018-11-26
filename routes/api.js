const apiRouter = require("express").Router();

const topicsRouter = require("./topics");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");

// const passport = require('passport')

apiRouter.route('')
.get((req, res, next) => {
  res.sendFile('api.html', {root: 'views'})
})

// apiRouter.get('', passport.authenticate('bearer', { session: false }), function(req, res, next) {
//   res.sendFile('api.html', {root: 'views'})
// })

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;