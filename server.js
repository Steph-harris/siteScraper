const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PORT = process.env.PORT || 8090;

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

const routes = require('./controllers/controllers.js');

app.use(routes);

app.listen(PORT, function(){
  console.log("Listening on port %s", PORT);
});
