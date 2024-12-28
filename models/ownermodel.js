const mongoose = require("mongoose");

const ownerschema = mongoose.Schema({
    fullname:String,
    email:String,
    password:String,
    orders:{
        type:Array,
        default:[]
    },
    picture:String,
    gstin:String
});

module.exports = mongoose.model("user",userschema);