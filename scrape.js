const request = require('request')
const cheerio = require('cheerio')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/tc';

// Job function using connect method
module.exports = function() {
  MongoClient.connect(url, importArticles);
};

urls = [
  'https://techcrunch.com/popular/',
  'https://techcrunch.com/startups/',
  'https://techcrunch.com/mobile/',
  'https://techcrunch.com/gadgets/',
  'https://techcrunch.com/social/',
  'https://techcrunch.com/enterprise/'
];
// Callback to close mongo connection after all urls processed
let requestsCompleted = 0;
function done(db) {
  requestsCompleted += 1;
  if (requestsCompleted === urls.length) {
    const collection = db.collection('meta');
    db.collections().then((collections) => {
      if (collections.indexOf('meta') !== -1) {
        return collections.drop();
      } else {
        return null;
      }
    }).then((reply) => {
      return collection.insertOne({
        lastModified: Date.now()
      });
    }).then(() => {
      db.close();
    }).catch((err) => {
      console.log(err.stack);
    });
  }
}

// Variable names starting with '$' represent cheerio objects
function importArticles(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to mongodb");
  const collection = db.collection('articles');
  // Import from blank table
  db.collections().then((collections) => {
    if (collections.indexOf('articles') !== -1) {
      return collections.drop();
    } else {
      return null;
    }
  }).then((reply) => {
    urls.forEach((url) => {
      request(url, (error, response, html) => {
        if (error) {
          console.log(`Request error for ${url}`);
          return;
        }
        const $ = cheerio.load(html);

        const category = url.substring(23, url.length - 1)
        let articles = [];
        // Page typically has 2 separate ul's, each of which contain list of articles
        const $articleUls = $('ul.river');
        $articleUls.each((i, elem) => {
          $(elem).find('li.river-block').each((i, elem) => {
            const document = {};
            const $riverBlock = $(elem);
            const href = $riverBlock.attr('data-permalink');
            document.href = href;
            // Each block is the div containing title, excerpt, etc.
            // find() ~should~ return only 1 element;
            const $blocks = $riverBlock.find('div.block-content', 'div.block-content-brief');
            if ($blocks.length === 1) {
              const $block = $blocks.first();
              const title = $block.find('h2 a').text();
              document.title = title;
              // Excerpt is not always present
              const $excerpt = $block.find('p')
              if ($excerpt.length === 1) {
                const excerptText = $excerpt.text().substring(0, 140);
                document.excerpt = excerptText;
              }
            }
            // Tag is not always present
            const $tags = $riverBlock.find('div.tags a span')
            if ($tags.length === 1) {
              const tag = $tags.text();
              document.tag = tag;
            }
            if (document.title) {
              document.category = category;
              articles.push(document);
            }
          });
        });
        if (articles.length > 0) {
          collection.insertMany(articles);
        }
        console.log(`Inserted ${articles.length} articles from ${url}`);
        // Increment completion count
        done(db);
      });
    });
  });
}
