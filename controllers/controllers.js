var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var gamedayHelper = require( 'gameday-helper' );
var nba = require('nba');
var logger = require("morgan");
var db = require("../config/connection.js");
var HDate = new Date();

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

    $('.p-headline-stack ul li a').each(function(i, element){
      var headline = $(element).text();
      var headLink = $(element).attr('href');
      var headDate = Date.now();

      var newHeadline = new Headline ({
        headline: headline,
        headLink: headLink,
        headDate: headDate
      });

      console.log(headline);
      console.log(headLink);
      console.log(headDate);

      if(headline && headLink && headDate){
        newHeadline.save(function(err, saved){
          if(err){
            console.log(err);
          } else {
            console.log("saved to db");
          }
        });
      } else {
        console.log("nothing saved");
      }
    });
  } else {
    console.log("error occurred while scraping");
  }
});

router.get("/scrapedNBA", function(req, res){
  request('http://data.nba.com/data/5s/v2015/json/mobile_teams/nba/2016/scores/00_todays_scores.json',
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body); // Show the HTML for the Google homepage.
        // res.render("hoops", body);
      }
    }
  // console.log("date is " +new Date());
  // nba.stats.scoreboard("00", "0", "2017-02-06")
  //   .then(function (players) {
  //     var str = JSON.stringify(players, null, 2);
  //     res.send(JSON.parse(str));
  //   })
  //   .catch(function(err){
  //     console.log(err);
  //   });
  )
});

//Get game data from mlb.com
router.get("/", function(req, res){
  gamedayHelper.miniScoreboard(new Date())
  .then(function(data){
  var games = data.game;

  // console.log(games);
  res.render("home", {
    games: games
  })
  })
  .catch( function(error) {
  console.log(error);
  })
});

//Get data from NBA package
router.get("/alt", function(req, res){
    //get data from package and set as var
    var nbaData =
   res.render("hoops", {
      bball: games
   })
});

router.get("/scrapedData", function(req, res){
  //grab all data from Headline table starting from bottom
  Headline.find({}).sort({headDate: -1})
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
