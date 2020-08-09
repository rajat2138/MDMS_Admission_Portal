const mongoose = require("../config/dbconfig.js")

const paylogSchema = new mongoose.Schema({
  ordId : String,
  userId : String,
  status : Boolean,
  response : Object
})

const PaymentLog = new mongoose.model("paymentlog", paylogSchema)
module.exports = PaymentLog;
