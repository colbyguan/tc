const express = require('express')
const MongoClient = require('mongodb').MongoClient
const schedule = require('node-schedule')
const assert = require('assert')
const scrape = require('./scrape')
const app = express()
const url = 'mongodb://localhost:27017/tc';
const state = {
  db: null
};

app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/all', function (req, res) {
  const collection = state.db.collection('articles');
  collection.find({}).toArray((err, docs) => {
    if (err) {
      res.status(500).json({error: err});
    } else {
      res.json({result: docs});
    }
  })
});

const job = schedule.scheduleJob('* /15 * * * *', scrape);
// Also scrape on startup
scrape();

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log('Unable to connect to mongodb')
    process.exit(1);
  } else {
    console.log("Connected successfully to mongodb");
    state.db = db;

    app.listen(app.get('port'), () => {
      console.log(`Find the server at: http://localhost:${app.get('port')}/`);
    });
  }
});
