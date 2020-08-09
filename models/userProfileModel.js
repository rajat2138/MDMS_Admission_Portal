const mongoose = require("../config/dbconfig.js")
const userProfileSchema = new mongoose.Schema({
  fullname : String,
  aadhar : String,
  dob : Date,
  mothername : String,
  fathername : String,
  city : String,
  pin : String,
  address : String,
  tcslcno : Number,
  tcslcdate : Date
});
const UserProfile = mongoose.model("userprofile", userProfileSchema);

module.exports = UserProfile;
