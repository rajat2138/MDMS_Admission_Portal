const checksum_lib  = require("./paytm/checksum.js")
const User          = require("../models/userModel.js");
const PaymentLog    = require("../models/paymentLogModel.js");

module.exports = (app)=>{
  app.post("/payment", function(req,res){
    if(req.isAuthenticated()){
      User.findById(req.user._id, (err, user)=>{
        if(err){
          console.log(err);
          res.send("Some Error Occured")
        }
        else{
          if(user.stage<14){
            res.send("Please Fill Admission Form and Upload Documents Before Payment")
          }
          else if(user.stage>14){
            res.send("Payment Already Done")
          }
          else{
            const txnId = "MDMS_ADM_"+(new Date()).getTime().toString(36);
            const newpaylog = new PaymentLog({
              ordId : txnId, userId : req.user._id, response : null, status : false
            })
            newpaylog.save(function(err){
              if(err){
                console.log(err);
                res.send("Some Eror Occured")
              }
              else{
                let txn_amt=0;
                if(user.isEleven) {txn_amt="200.00";}
                else {txn_amt="100.00";}

                let params={}
                params["MID"]="MID_KEY",
                params["WEBSITE"]="WEBSTAGING",
                params["CHANNEL_ID"]="WEB",
                params["INDUSTRY_TYPE_ID"]="Retail",
                params["ORDER_ID"]=txnId,
                params["CUST_ID"]=user._id.toString(),
                params["TXN_AMOUNT"]=txn_amt,
                params["CALLBACK_URL"]="CALLBACK_URL",
                params["EMAIL"]=user.username,
                params["MOBILE_NO"]=user.mobile

                checksum_lib.genchecksum(params,"PAYTM_KEY", function(err, checksum){
                  let txn_url= "https://securegw-stage.paytm.in/order/process"
                  let form_feilds=""
                  for(x in params){
                    form_feilds += "<input type='hidden' name='"+x+"' value='"+params[x]+"' />"
                  }
                  form_feilds += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' />"
                  var html = '<html><body><center><h1>Please Wait! Do not refresh the page.....</h1><form method="POST" action="'+txn_url+'" name="f1">'+form_feilds+'</form><script type="text/javascript">document.f1.submit()</script></center></body></html>'
                  res.writeHead(200, {'Content-Type' : 'text/html'})
                  res.write(html)
                  res.end()
                });
              }
            });
          }
        }
      });
    }
    else{
      res.redirect("/login")
    }
  });

  app.post("/postpayment", function(req, res){
    const paytmResponse = req.body;
    let status=false;
    if(paytmResponse.RESPCODE=='01')  status=true
    PaymentLog.findOne({ordId : paytmResponse.ORDERID}, function(err, paylog){
      if(err){
        console.log(err);
        res.send("Some Error Occured");
      }
      else{
        PaymentLog.updateOne({_id :paylog._id}, {response : paytmResponse,status: status}, function(err){
          if(err){
            console.log(err);
            res.send("Some Error Occured");
          }
          else{
            if(paytmResponse.RESPCODE=='01'){
            User.updateOne({_id :paylog.userId}, {stage : 15}, function(err){
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
            res.redirect("/user")
          }
          }
        })
      }
    })
  });
}
