const User = require("../models/userModel.js");
const FileModel = require("../models/fileModel.js");

const stageMap=["photo", "sign", "aadhar", "fphoto", "fsign", "mphoto", "msign", "tcslc", "marksheet", "registration", "admitcard", "migration"]

const fs = require('fs');
const path = require('path');
const dirname = require("../uploads/dirname.js")
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });

module.exports = (app)=> {
  app.post("/upload/:folder", upload.single("filedata"), (req,res)=>{
    const folder = req.params.folder;
    if(req.isAuthenticated()){
      User.findById(req.user._id, function(err,user){
        if(err){
          console.log(err);
          res.send("Some Error Occured")
        }
        else{
          const stage=user.stage;
          if(stage<2 | stage>13 | stageMap[stage-2]!= folder){
            res.send("<center><h1>Bad Request</h1></center>")
          }
          else{
            const newfile= {
              userId : user._id,
              docType : folder,
              img : {
                  data: fs.readFileSync(path.join(dirname +"/"+ req.file.filename)),
                  contentType: 'image/png'
                }
              }
              FileModel.create(newfile, (err,item)=>{
                if(err){
                  console.log(err);
                  res.send("Some Error Occured")
                }
                else{
                  let newstage=stage+1;
                  if(user.isEleven == false & stage==9){
                    newstage=14;
                  }
                  User.updateOne({_id : req.user._id}, {stage : newstage}, function(err){
                    if(err){
                      console.log(err);
                      res.send("Some Error Occured");
                    }
                    else{
                      fs.unlink(path.join(dirname +"/"+ req.file.filename), (err) => {
                        if(err){
                          console.log(err);
                          res.send("Some Error Occured");
                        }
                        else{
                          res.redirect("/user")
                        }
                    });
                  }
                })
              }
            })
          }
        }
      })
    }
    else{
      res.send("Unauthorized. Access Denied")
    }
  })

  app.get("/skip",(req,res)=>{
    if(req.isAuthenticated()){
      User.findById(req.user._id, function(err,user){
        if(err){
          console.log(err);
          res.send("Some Error Occured")
        }
        else{
          const stage=user.stage
          if(stage==5 | stage==6 | stage==7 | stage==8 | stage==9 | stage==11 | stage==13){
            User.updateOne({_id : req.user._id}, {stage : stage+1}, function(err){
              if(err){
                console.log(err);
                res.send("Some Error Occured");
              }
              else{
                res.redirect("/user")
              }
            })
          }
          else{
            res.send("<h1>Bad request.</h1><br><a href='/user'>Go Back</a>")
          }
        }
      })
    }
    else{
      res.redirect("/login")
    }
  })
}
