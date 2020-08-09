const User = require("../models/userModel.js")

  module.exports = (app)=>{
  app.get("/user", function(req,res){
    if(req.isAuthenticated()){
      User.findById(req.user._id, function(err, user){
        if(err){
          console.log(err);
          res.send("Some Error Occured")
        }
        else{
          stage=user.stage;
          if(stage==1){
            res.render("admform", {isEleven : user.isEleven})
          }
          else if(stage==2){
            res.render("fileupload", {msg : "Applicant's Photo", req_file : "photo"})
          }
          else if(stage==3){
            res.render("fileupload", {msg : "Applicant's Signature", req_file : "sign"})
          }
          else if(stage==4){
            res.render("fileupload", {msg : "Aadhar Card", req_file : "aadhar"})
          }
          else if(stage==5){
            res.render("fileupload", {msg : "Father's Photo", req_file : "fphoto"})
          }
          else if(stage==6){
            res.render("fileupload", {msg : "Father's Signature", req_file : "fsign"})
          }
          else if(stage==7){
            res.render("fileupload", {msg : "Mother's Photo", req_file : "mphoto"})
          }
          else if(stage==8){
            res.render("fileupload", {msg : "Mother's Signature", req_file : "msign"})
          }
          else if(stage==9){
            res.render("fileupload", {msg : "Tc / SLC", req_file : "tcslc"})
          }
          else if(stage==10){
            res.render("fileupload", {msg : "Xth Marksheet", req_file : "marksheet"})
          }
          else if(stage==11){
            res.render("fileupload", {msg : "Registration Card", req_file : "registration"})
          }
          else if(stage==12){
            res.render("fileupload", {msg : "Xth Admit Card", req_file : "admitcard"})
          }
          else if(stage==13){
            res.render("fileupload", {msg : "Migration Certiicate", req_file : "migration"})
          }
          else if (stage==14){
            const amt = user.isEleven?200:100
            res.render("payment", {user: user, amt : amt})
          }
          else{
            res.send("<center><h1>Your Form Has Been Submitted Successfully! We will contact you soon</h1></center>");
          }
        }
      })
    }
    else{
      res.redirect("/");
    }
  })
}
