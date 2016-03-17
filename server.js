var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
var PORT = process.env.PORT || 8080;

//get css,js, or images from files in public folder
app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

var routes = require('./controllers/controllers.js');
var Note = require('./models/note.js');

//KEEP THIS
// app.get("/scrapedData", function(req, res){
//   //grab all data from Headline table
//   Headline.find({}, function(err, headlines){
//     if(err){
//       throw (err);
//     } else {
//       // res.render("home", {headlines});

//       console.log(headlines);
//       res.json(headlines);
//     }
//   });
// });

app.use(routes);

app.listen(PORT, function(){
  console.log("Listening on port %s", PORT);
});
