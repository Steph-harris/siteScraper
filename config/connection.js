//database configuration
require("dotenv").config();
var mongoose = require('mongoose');
var db = mongoose.connection;

if(process.env.NODE_ENV === 'production') {
  // HEROKU DB
  console.log(process.env.MONGOLAB_URI);

  mongoose.connect(process.env.MONGOLAB_URI);
}
else {
  // LOCAL DB
  var dbURI = 'mongodb://localhost/scraped';
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

// mongoose.connection.on("disconnected", function() {
//   console.log("mongoose disconnected");
// });

// gracefulShutdown = function(msg, callback) {
//   mongoose.connection.close(function() {
//     console.log("Mongoose disconnected through " + msg);
//     callback();
//   });
// };

// process.on('SIGINT', function() {
//   gracefulShutdown('app termination', function() {
//     process.exit(0);
//   });
// });

// process.on('SIGTERM', function() {
//   gracefulShutdown('heroku termination', function() {
//     process.exit(0);
//   });
// });
