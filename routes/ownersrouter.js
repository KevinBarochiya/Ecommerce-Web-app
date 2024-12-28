const express= require("express");
const router=express.Router();
const ownermodel=require("../models/ownermodel");

router.get("/",function(req,res){
    res.send('hey');
});
if(process.env.NODE_ENV === "development"){
    router.post("/create",function(req,res){
        res.send('its working');
    });
};

module.exports=router;