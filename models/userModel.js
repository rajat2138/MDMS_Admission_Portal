const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require("../config/dbconfig.js")

const userSchema = new mongoose.Schema({
  fname : String,
  lname : String,
  isEleven : Boolean,
  username : String,
  mobile : String,
  stage : Number,
  class : String
});
userSchema.plugin(passportLocalMongoose,{
  selectFields: "fname lname username isEleven mobile isAdmin stage"
});
const User = mongoose.model("user", userSchema);

module.exports = User;
