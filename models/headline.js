const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HeadlineSchema = new Schema({
  headline: {
    type: String,
    unique: true
  },
  headLink: {
    type: String
  },
  headDate:{
    type: Date
  },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note'}]
});

const Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;
