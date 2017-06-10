require("dotenv").config();

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var gamedayHelper = require( 'gameday-helper' );
var nba = require('nba');
var logger = require("morgan");
var db = require("../config/connection.js");
var version = "20170513";
var secret = process.env.CLIENT_SECRET;
var strp = secret.replace("nodemon","");
var client = process.env.CLIENT_ID;

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
  //look inside req object for caller
  gamedayHelper.miniScoreboard(new Date())
  .then(function(data){
    console.log(data);
    var games = data.game;
    var inP = 0;

    //MODIFY JSON TO USE W/ HANDLEBARS
    for(var i=0; i<games.length; i++){
      var status = data.game[i].status;
      if( status == "Preview" || status == "Pre-Game" || status == "Warmup"){
        data.game[i].showTimeDisplay = true;
      }

      if(data.game[i].status == "In Progress"){
        data.game[i].inProgress = true;
        inP++;
        //only show info for in status games
        console.log(data.game[i]);
      }

      if(data.game[i].status == "Final"){
        console.log(data.game[i]);
      }

      if(data.game[i].top_inning == "Y"){
        data.game[i].topHalf = true;
      }
    }

    console.log(inP + " games are in progress");

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
  Headline.find({}).sort({headDate: -1}).limit(10)
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

    console.log(`Game id is ${gDt}`);

  var getGameDT = gamedayHelper.linescore(gDt)
  .then(function(data){
    // console.log(data);
    venueData.push({"scores": data});
    return data;
  })
  .catch( function(error) {
  console.log(error);
  });

  var getGamePics = request(FourSRURL,
    function (error, response, body) {
      var bodyPrs = JSON.parse(body);
      var picArray;

      venueData.push(bodyPrs["response"]["venues"]);

      if (!error && response.statusCode == 200) {
        var venueID = bodyPrs["response"]["venues"][0]["id"];

        // console.log("response - "+body);
        // console.log("id is " + venueID);

        picArray = getVenuePhotos(venueID, function(results){
          // console.log("photos: "+ results);
          venueData.push({photos:results});
          return results;
          // res.send(venueData);
        });
      } else {
        console.log("Error occurred:" + error);
      }
  });

  var gData = getGameDT();
  var pData = getGamePics();

  $.when(gData, pData)
  .then(
    console.log(venueData);
    res.send(venueData);
  );
});

function getVenuePhotos(venueID, callback){
  var new4sqURL = "https://api.foursquare.com/v2/venues/"+venueID+"/photos"
      new4sqURL += "?limit=5&client_secret="+ strp+"&client_id="+client+"&v="+version;

  request(new4sqURL,
    function (error, response, body) {
      var bodyPrs = JSON.parse(body);
      var bodyPrsln = bodyPrs["response"]["photos"]["items"].length;
      var picsArray = [];

      if (!error && response.statusCode == 200) {
        // console.log("Pics will be inside: " +bodyPrs);

        //assembling photo links for venue
        for(var i=0; i<bodyPrsln; i++){
          var picLinkA = bodyPrs["response"]["photos"]["items"][i]["prefix"];
          var size = "original";
          var picLinkB = bodyPrs["response"]["photos"]["items"][i]["suffix"];

          picsArray.push(picLinkA+size+picLinkB);
        }

        //send back array of pic links
        // console.log(picsArray);
        callback(picsArray);
      } else {
        console.log("Error occurred:" + error);
      }
  });
}

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
