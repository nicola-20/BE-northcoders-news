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
    console.log(err);
    res.status(500).send({ msg: 'Internal server error' })
})

module.exports = app;