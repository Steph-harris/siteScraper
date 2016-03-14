var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require('mongoose');
var logger = require("morgan");

var app = express();
var PORT = process.env.PORT || 8080;

//get css,js, or images from files in public folder
app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//database configuration
mongoose.connect('mongodb://localhost/scraped');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

//Require Schemas
var Note = require('./models/note.js');
var Headline = require('./models/headline.js');

  // request('http://www.mlb.com/home', function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     $ = cheerio.load(body);
  //     $('#latest-news ul li a').each(function(i, element){
  //       var headline = $(element).text();
  //       var headLink = $(element).attr('href');

  //       var newHeadline = new Headline ({
  //         headline: headline,
  //         headLink: headLink
  //       });

  //       console.log(headline);
  //       console.log(headLink);

  //       if(headline && headLink){
  //         newHeadline.save(function(err, saved){
  //           if(err){
  //             console.log(err);
  //           } else {
  //             console.log("saved to db");
  //           }
  //         });
  //       }
  //     });
  //   }
  // });

app.get("/", function(req, res){
  res.render("home");
});

app.get("/scrapedData", function(req, res){
  //grab all data from Headline table
  Headline.find(function(err, headlines){
    if(err){
      throw (err);
    } else {
      res.render("home", {headlines});

      // console.log(headlines);
      // res.json(headlines);
    }
  });
});


app.listen(PORT, function(){
  console.log("Listening on port %s", PORT);
});
