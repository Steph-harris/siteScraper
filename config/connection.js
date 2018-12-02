//database configuration
require("dotenv").config();
var mongoose = require('mongoose');
var db = mongoose.connection;

if(process.env.NODE_ENV === 'production') {
  // HEROKU DB
  mongoose.connect(process.env.MONGOLAB_URI);
} else {
  // LOCAL DB
  var dbURI = 'mongodb://mongo/scraped';
  console.log("Local mongoose connection is ", dbURI);
  mongoose.connect(dbURI);
}

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

module.exports = db;
