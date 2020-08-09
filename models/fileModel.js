const mongoose = require("../config/dbconfig.js")


const fileSchema= new mongoose.Schema({
  userId : String,
  docType : String,
  img : {
    data : Buffer,
    contentType : String
  }
});
const FileModel = new mongoose.model("fileupload",fileSchema);

module.exports = FileModel;
