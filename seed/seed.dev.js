process.env.NODE_ENV = 'production'
const seedDB = require('./seed.js');
const mongoose = require('mongoose');
const { DB_URL, datapath } = process.env.NODE_ENV === 'production' ? process.env : require('../config');
const rawData = require(`../seed/${datapath}`)

mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${DB_URL}`)
    return seedDB(rawData)
  })
  .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
    return mongoose.disconnect()
  })
  .then(() => {
    console.log('Disconnected')
  })
  .catch(console.log)