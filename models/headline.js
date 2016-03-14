var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
  headline: {
    type: String,
    unique: true
  },
  headLink: {
    type: String
  },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note'}]
});

var Headline = mongoose.model("Headline", HeadlineSchema);
module.exports = Headline;
