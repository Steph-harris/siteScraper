require("dotenv").config();

var compression = require('compression');
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var gamedayHelper = require( 'gameday-helper' );
var logger = require("morgan");
var async = require("async");
var db = require("../config/connection.js");
var version = "20170513";
var secret = process.env.CLIENT_SECRET;
var strp = secret.replace("nodemon","");
var client = process.env.CLIENT_ID;
var today = new Date();
var yestToday = new Date(today);
var tomorrow = new Date(today);
today.setHours(today.getHours() - 4);
yestToday.setDate(today.getDate() - 1);
tomorrow.setDate(today.getDate() + 1);

console.log(`today is ${today}`);

router.use(compression());
//get css,js, or images from files in public folder
router.use(express.static('public'));

router.use(logger('dev'));
router.use(bodyParser.urlencoded({extended:false}));

//Require Schemas
var Note = require('../models/note.js');
var Headline = require('../models/headline.js');

function getVenuePhotos(venueID, callback){
  var new4sqURL = "https://api.foursquare.com/v2/venues/"+venueID+"/photos"
  new4sqURL += "?limit=5&client_secret="+ strp+"&client_id="+client+"&v="+version;

  request(new4sqURL,
    function (error, response, body) {
      var bodyPrs = JSON.parse(body);
      var bodyPrsln = bodyPrs["response"]["photos"]["items"].length;
      var picsArray = [];

      if (!error && response.statusCode == 200) {
        //assembling photo links for venue
        for(var i=0; i<bodyPrsln; i++){
          var picLinkA = bodyPrs["response"]["photos"]["items"][i]["prefix"];
          var size = "original";
          var picLinkB = bodyPrs["response"]["photos"]["items"][i]["suffix"];

          picsArray.push(picLinkA+size+picLinkB);
        }

        //send back array of pic links
        callback(picsArray);
      } else {
        console.log("Error fetching venue photos:" + error);
      }
  });
}

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

      if(headline && headLink && headDate){
        newHeadline.save(function(err, saved){
          if(err){
            // console.log(err);
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

const standings_request = {
  url: 'https://erikberg.com/mlb/standings.json',
  headers: {
    'User-Agent': 'DailyMLBriefing/1.0.0 +https://mlbscrape.herokuapp.com/'
  }
};

router.get("/standings", function(req, res){
  request(standings_request, function (error, response, body) {
      var standPrs = JSON.parse(body);

      // console.log(body);
      // console.log(standPrs);
      return standPrs
  });
});

//Get game data from mlb.com
router.get("/", function(req, res){
  async.parallel({
    games: function(callback){
      gamedayHelper.masterScoreboard(today)
      .then(function(data){
        var games = data.game;

        //MODIFY JSON TO USE W/ HANDLEBARS
        if(games){
          var gamesLn = games.length ? games.length : 0;
          var inP = 0;

          if(typeof gamesLn == "undefined"){
            //Returns A Single Object, not Array, if only 1 game
            gamesLn = 1;
            data.game[0] = data.game;
          }

          for(let i=0; i < gamesLn; i++){
            let status = data.game[i].status.status;
            if( status == "Preview" || status == "Pre-Game" || status == "Warmup"){
              data.game[i].showTimeDisplay = true;
            }

            if(status == "In Progress"){
              data.game[i].inProgress = true;
              inP++;
            }

            if(status == "Final"){
              data.game[i].isFinal = true;
            }

            if(data.game[i].top_inning == "Y"){
              data.game[i].topHalf = true;
            }
          }
        }
        console.log("there are "+ gamesLn +" games today");
        callback(null, games);
      })
    },
    dbHeadlines: function(callback){
      Headline.find({}).lean().sort({headDate: -1}).limit(10)
      .populate("notes")
      .exec(function(err, dbHeadlines){
        if(err){
          console.log(err);
        } else {
          // console.log(dbHeadlines);
        }
        callback(null, dbHeadlines);
      });
    }
  },
    function(err, results){
      res.render("home", {pageData: results})
  });
});

router.get("/gameDate/:date", function(req, res){
  var date;

  if(req.params.date == "yesterday"){
    date = yestToday;
  } else if(req.params.date == "tomorrow"){
    date = tomorrow;
  } else if(req.params.date == "today"){
    date = today;
  }

  gamedayHelper.masterScoreboard(date)
  .then(function(data){
    // console.log(data);
    var games = data.game;
    var inP = 0;
    // console.log("Today's games: "+games);
    //MODIFY JSON TO USE W/ HANDLEBARS
    if(games){
      for(var i=0; i<games.length; i++){
        var status = data.game[i].status;
        if( status == "Preview" || status == "Pre-Game" || status == "Warmup"){
          data.game[i].showTimeDisplay = true;
        }

        if(data.game[i].status == "In Progress"){
          data.game[i].inProgress = true;
          inP++;
        }

        if(data.game[i].top_inning == "Y"){
          data.game[i].topHalf = true;
        }
      }
    }
    callback(null, games);
    res.send(games);
  });
});

router.get("/scrapedData", function(req, res){
  //grab all data from Headline table starting from bottom
  Headline.find({}).lean().sort({headDate: -1}).limit(10)
  .populate("notes")
  .exec(function(err, dbHeadlines){
    if(err){
      res.send(err);
    } else {
      res.send(dbHeadlines);
    }
  });
});

router.get("/foursquare/:place/:city/:gameID", function(req, res){
  var venueData = [];
  var place = req.params.place;
  var city = req.params.city;
  var gameDt = req.params.gameID;
  var gDt = `gid_${gameDt.slice(0,4)}_${gameDt.slice(4,6)}_${gameDt.slice(6,8)}_`
      gDt += `${gameDt.slice(8,14)}_${gameDt.slice(14,20)}_${gameDt.slice(20,21)}`;
  var FourSRURL = "https://api.foursquare.com/v2/venues/search?intent=global&query="
    FourSRURL += place+"&limit=1&client_secret="+ strp
    FourSRURL += "&client_id="+client+"&v="+version;

  var getPhts = function(){
    request(FourSRURL,
      function (error, response, body) {
        var bodyPrs = JSON.parse(body);
        var picArray;

        venueData.push(bodyPrs["response"]["venues"]);

        if (!error && response.statusCode == 200) {
          var venueID = bodyPrs["response"]["venues"][0]["id"];

          picArray = getVenuePhotos(venueID, function(results){
            venueData.push({photos:results});

            res.send(venueData);
          });
        } else {
          console.log("Error fetching venue id: " + error);
        }
      })
    };

  console.log(`Game id is ${gDt}`);

  gamedayHelper.linescore(gDt)
  .then(function(data){
    var dt = JSON.parse(data);
    venueData.push({"scores": dt});

    getPhts();
  })
  .catch( function(error) {
    console.log(error);
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
