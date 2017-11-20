require('newrelic')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const schedule = require('node-schedule')
const assert = require('assert')
const scrape = require('./scrape')
const app = express()
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/tc';
const state = {
  db: null,
  articles: []
};

app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/all', function (req, res) {
  const articles = state.db.collection('articles');
  const meta = state.db.collection('meta');
  articles.find({}).toArray().then((docs) => {
    state.articles = docs;
    return meta.findOne({}, {});
  }).then((doc) => {
    res.json({articles: state.articles, lastModified: doc.lastModified});
  }).catch((err) => {
    console.log(err.stack);
    res.status(500).json({error: err});
  });
});

const job = schedule.scheduleJob('*/15 * * * *', scrape);
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
