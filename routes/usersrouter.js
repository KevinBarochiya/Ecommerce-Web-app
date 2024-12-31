const express= require("express");
const router = express.Router();
const isLoggedin=require("../middlewares/isLoggedin");
const {registerUSER,loginuser,logout} = require("../controllers/authController");

router.get("/",function(req,res){
    res.send('hey');
});

router.post("/register",registerUSER);
router.post("/login",loginuser);
router.get("/logout",logout);

module.exports=router;