const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const { DB_URL } = require('./config')

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to DB..')
  })


app.set('view engine', 'ejs');

app.use(bodyParser.json());
  
app.use(express.static('public'));


app.use('/api', apiRouter);
  
app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'Path not found' })
})
  


app.use((err, req, res, next) => {
// console.log(err)
  if (err.status) { // if err has a status

    if (err.msg || err.message) {
      res.status(err.status).send(err)
    } else {
      err.msg = "Unknown error"
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
      err.msg = 'Internal Server Error'
    } 

    res.status(err.status).send(err)
  }
})

module.exports = app;