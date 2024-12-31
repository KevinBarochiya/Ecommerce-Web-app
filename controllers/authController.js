const usermodel=require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const {generateToken}=require("../utils/generateToken");

module.exports.registerUSER =async function(req,res){
    try{
        let {email,fullname,password}=req.body;
        let user = await usermodel.findOne({email});
        if(user){
            return res.status(401).send("You already have account, please login");
        }
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,async function(err,hash){
                if(err) return res.send(err.message);
                else{
                    let user = await usermodel.create({
                        email,
                        fullname,
                        password:hash
                        });
                    let token = generateToken(user);
                    res.cookie("token",token);
                    return res.redirect("/shop");
                }
            });
        });
    }
    catch(err){
        res.send(err.message);
    }   
}

module.exports.loginuser = async function (req,res) {
    let {email,password}=req.body;
    let user = await usermodel.findOne({email});
    if(!user){
        return res.send('email or password incorrect');
    }
    bcrypt.compare(password,user.password,function(err,result){
        if(result){
            let token=generateToken(user);
            res.cookie("token",token);
            return res.redirect("/shop");
        }
        else{
            res.send('email or password incorrect');
        }
    });
};

module.exports.logout = async function (req,res) {
    res.clearCookie("token");
    res.redirect("/");
};