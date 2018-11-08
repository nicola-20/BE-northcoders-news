const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const { DB_URL } = require('./config')
// const { handle400s, handle404s, handle500s } = require('./errors')

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to DB..')
  })


app.set('view engine', 'ejs');

app.use(bodyParser.json());
  
app.use(express.static('public'));
  
// app.get('/', (req, res, next) => {
//   res.render('index')
// })

app.use('/api', apiRouter);
  
app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'Path not found' })
})
  
// app.use(handle400s);
// app.use(handle404s);
// app.use(handle500s);

app.use((err, req, res, next) => {
// console.log(err)
  if (err.status) { // if err has a status

    if (err.msg || err.message) { // if err has a message
      res.status(err.status).send(err)

    } else { // if err has status but no message
      err.msg = "Error"
      res.status(err.status).send(err)
    }

  } else { // if error doesnt have a status yet

    if (err.name === "CastError") {
      err.status = 400
      err.msg = err.message
    } else if (err.name === "ValidationError") {
      err.status = 400
      err.msg = err.message
    } else {
      err.status = 500
    } 

    res.status(err.status).send(err)
  }
    
    // 400 Bad Request
    // 404 Not Found
    // 405 Method Not Allowed
    // 500 Internal Server Error
  
    // res.status(500).send({ msg: 'Internal Server Error' })
})

module.exports = app;