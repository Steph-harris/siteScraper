var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/my_database');

var app = express();
var PORT = process.env.PORT || 8080;

//get css,js, or images from files in public folder
app.use('/scripts', express.static('public/scripts'));
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/images'));

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

request('http://www.mets.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    $('#homepage_container a').each(function(i, element){
      var ad = $(this).prev();
      console.log(ad.text()); // Show the HTML for this page.
    });
  }
});

app.get("/", function(req, res){
  res.render("home");
});

app.listen(PORT, function(){
  console.log("Listening on port %s", PORT);
});
