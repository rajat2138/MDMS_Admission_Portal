const User = require("../models/userModel.js")
const passport = require('passport');

module.exports = (app)=>{
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


  app.get("/register", function(req,res){
    if(req.isAuthenticated()){
      res.redirect("/instructions")
    }
    else{
      res.render("register");
    }
  });
  app.post("/register", function(req,res){
    if(req.isAuthenticated()){
      res.redirect("/instructions")
    }
    else{
      let isEleven = false;
      if (req.body.admcategory=='11') {isEleven=true;}
        const newUser = {
          username : req.body.username,
          fname : req.body.fname,
          lname : req.body.lname,
          mobile : req.body.mobile,
          class : req.body.admcategory,
          isEleven : isEleven,
          stage : 1
        }
        User.register(newUser, req.body.password, function(err, user){
          if(err){
              console.log(err);
              const msg = "Error occcured. Try Again";
              res.send(msg);
          }
          else{
            passport.authenticate("local")(req, res, function(){
              res.redirect("/instructions")
              });
          }
      });
    }
  });

  app.get("/login", function(req,res){
    if(req.isAuthenticated()){
      res.redirect("/instructions")
    }
    else{
      res.render("login")
    }
  })
  app.post("/login", function(req,res){
    if(req.isAuthenticated()){
      res.redirect("/instructions")
    }
    else{
      const user = new User({
        username : req.body.username,
        password : req.body.password
      });
      req.login(user, function(err) {
        if(err){
          console.log(err);
          const msg = "Error Occured. Try Again";
          res.render("custom",{msg : msg});
        }
        else{
          User.findOne({username : req.body.username}, function(err, user){
            if(err){
              console.log(err);
            }
            else if(!user){
              res.send("<center><h1 style='color:blue;'>User Not Found! Please Register Yourself....</h1></center>")
            }
            else{
              passport.authenticate("local")(req, res, function(){
                res.redirect("/instructions")
              });
            }
          });
        }
      });
    }
  });
  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/home")
  });
}
