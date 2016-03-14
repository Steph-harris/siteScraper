var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require('mongoose');
var logger = require("morgan");

var app = express();
var PORT = process.env.PORT || 8080;

//get css,js, or images from files in public folder
app.use(express.static('public'));

//database configuration
mongoose.connect('mongodb://localhost/scraped');
var db = mongoose.connection;

app.get("/", function(req, res){
  request('http://www.mlb.com/home', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);
      $('#latest-news ul li a').each(function(i, element){
        var headline = $(element).text();
        var headLink = $(element).attr('href');
        // $(this).add('#anotherSelector')
        console.log(headline); // Show the HTML for this page.
        console.log(headLink); // Show the HTML for this page.
        if(headline && headLink){
          db.scraped.save({
            headline: headline,
            headLink: headLink
          }, function(err, saved){
            if(err){
              console.log(err);
            } else {
              console.log("saved to db");
            }
          });
        }
      });
    }
  });
  res.send("saved to db");
});

app.listen(PORT, function(){
  console.log("Listening on port %s", PORT);
});
