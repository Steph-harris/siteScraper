var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
var PORT = process.env.PORT || 8080;

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

var routes = require('./controllers/controllers.js');

app.use(routes);

app.listen(PORT, function(){
  console.log("Listening on port %s", PORT);
});
