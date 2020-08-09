const User = require("../models/userModel.js");
const UserProfile = require("../models/userProfileModel.js");
const ElevenAdmModel = require("../models/elevenAdmModel.js");

module.exports = (app)=>{
  app.post("/admission",function(req,res){
    if(req.isAuthenticated()){
      User.findById(req.user._id, function(err,user){
        if(err){
          console.log(err);
          res.send("Error Occurred. Try Again")
        }
        else {
          if (user.stage==1){
            const newuserprofile = new UserProfile({
              _id : req.user._id,
              fullname : req.body.fullname,
              aadhar : req.body.aadhar,
              dob : req.body.dob,
              mothername : req.body.mothername,
              fathername : req.body.fathername,
              city : req.body.city,
              pin : req.body.pin,
              address : req.body.address,
              tcslcno : req.body.tcslcno,
              tcslcdate : req.body.tcslcdate
            });
            newuserprofile.save(function(err){
              if(err){
                console.log(err);
                res.send("Error Occurred. Try Again")
              }
              else{
                let elevenAdmData;
                if(user.isEleven==true){
                  elevenAdmData = new ElevenAdmModel({
                    _id : req.user._id,
                    prevschool : req.body.prevschool,
                    prevboard : req.body.prevboard,
                    passingyear : req.body.passingyear,
                    registration : req.body.registration,
                    roll : req.body.roll,
                    marks : req.body.marks,
                    eng : req.body.english,
                    science : req.body.science,
                    math : req.body.math,
                    sst : req.body.sst,
                    lang2 : req.body.lang2,
                    stream : req.body.stream,
                  });
                  elevenAdmData.save(function(err){
                    if(err){
                      console.log(err);
                      res.send("Some Error Occured")
                    }
                    else{
                      User.updateOne({_id : req.user._id}, {stage : 2}, function(err){
                        if(err){
                          console.log(err);
                          res.send("Some Error Occured");
                        }
                        else{
                          res.redirect("/user");
                        }
                      })
                    }
                  });
                }
                else{
                  User.updateOne({_id : req.user._id}, {stage : 2}, function(err){
                    if(err){
                      console.log(err);
                      res.send("Some Error Occured");
                    }
                    else{
                      res.redirect("/user");
                    }
                  })
                }
              }
            })
          }
          else{
            res.send("Bad Request. Access Denied");
          }
        }
      })

    }
    else{
      res.send("Request Unauthorized");
    }
  });
}
