const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL,{useUnifiedTopology: true,useNewUrlParser : true});
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

module.exports = mongoose;
