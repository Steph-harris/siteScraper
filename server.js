var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/my_database');

var app = express();
var PORT = process.env.PORT || 8080;

app.listen(PORT, function(){
  console.log("Listening on port %s", PORT);
});
