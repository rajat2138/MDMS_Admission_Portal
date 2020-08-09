const mongoose = require("../config/dbconfig.js")
const elevenAdmSchema = new mongoose.Schema({
  prevschool : String,
  prevboard : String,
  passingyear : String,
  registration : String,
  roll : String,
  marks : Number,
  english : Number,
  science : Number,
  math : Number,
  sst : Number,
  lang2 : Number,
  stream : Number,
});
const ElevenAdmModel = mongoose.model("elevenAdmission", elevenAdmSchema);

module.exports = ElevenAdmModel;
