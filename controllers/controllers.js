var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var gamedayHelper = require( 'gameday-helper' );
var logger = require("morgan");
var db = require("../config/connection.js");

//get css,js, or images from files in public folder
router.use(express.static('public'));

router.use(logger('dev'));
router.use(bodyParser.urlencoded({extended:false}));

//Require Schemas
var Note = require('../models/note.js');
var Headline = require('../models/headline.js');

//Get articles from MLB.com and save them in Mongo
request('http://www.mlb.com/home', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    $('#latest-news ul li a').each(function(i, element){
      var headline = $(element).text();
      var headLink = $(element).attr('href');

      var newHeadline = new Headline ({
        headline: headline,
        headLink: headLink
      });

      // console.log(headline);
      // console.log(headLink);

      if(headline && headLink){
        newHeadline.save(function(err, saved){
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

//Get game data from mlb.com
gamedayHelper.miniScoreboard(new Date())
.then(function(data){
  var games = data.game;
  // Array of objects with data related to a single game
  for (var i = 0; i < games.length; i++) {
    console.log("Matchup: " + games[i].game_media.media.title);
    console.log("Location: " + games[i].location);
    console.log("Status: " + games[i].status);
  }
})
.catch( function(error) {
  console.log(error);
});

router.get("/", function(req, res){
  res.render("home");
});

router.get("/scrapedData", function(req, res){
  //grab all data from Headline table starting from bottom
  Headline.find({}).sort({_id: -1})
    .populate("notes")
    .exec(function(err, dbHeadlines){
      if(err){
        res.send(err);
      } else {
        res.send(dbHeadlines);
      }
    });
});

router.post("/newNote/:id", function(req, res){
  var newNote = new Note(req.body);

  newNote.save(function(err, doc){
    if(err){
      res.send(err);
    } else {
      //Find headline and add this note id
      Headline.findOneAndUpdate({
        _id:req.params.id
      }, {$push:{'notes': doc._id}}, {new:true}, function(err, doc){
        if(err){
          res.send(err);
        } else {
          res.redirect("/");
        }
      });
    }
  });
});

router.post("/deleteNote/:id", function(req,res){
  //Find headline and add this note id
  Note.remove({
    _id:req.params.id
  }, function(err){
    if(err){
      res.send(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
