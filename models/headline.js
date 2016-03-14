var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({

});

var Headline = mongoose.model("Headline", HeadlineSchema);
module.exports = Headline;
