require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const app = express();
app.use(bodyParser.urlencoded({extended : true, useNewUrlParser : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views/static'));
app.use(session({
  secret : process.env.PASSPORT_SESSION_SECRET,
  resave : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

require("./routes/login_register.js")(app);
require("./routes/userControl.js")(app);
require("./routes/admissionFormControl.js")(app);
require("./routes/fileUploadControl.js")(app);
require("./routes/payment.js")(app);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(req, res){
  console.log('Server Is Up and Running');
});
app.get("/",function(req,res){
  res.redirect("/home");
})
app.get("/home",function(req,res){
  res.render("home");
})
app.get("/instructions", (req,res)=>{
  if(req.isAuthenticated()){
    res.render("instructions")
  }
  else{
    res.redirect("/login")
  }
})
