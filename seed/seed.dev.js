const seedDB = require('./seed.js');
const mongoose = require('mongoose');
const { DB_URL, datapath } = require('../config');
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