const mongoose = require("mongoose");
const config=require("config");
const dbgr= require("debug")("development:mongoose");

mongoose
.connect(`${config.get("mongodb_uri")}/mega`)
.then(function(){
    dbgr("running");
})
.catch(function(err){
    console.log(err);
});

module.exports= mongoose.connection;