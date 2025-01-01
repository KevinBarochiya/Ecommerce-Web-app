const express = require("express");
const isLoggedin = require("../middlewares/isLoggedin");
const router= express.Router();
const productmodel=require("../models/productmodel");
const usermodel = require("../models/usermodel");

router.get("/",function(req,res){
    let error= req.flash("error");
    res.render("index",{error,loggedin:false});
});

router.get("/shop", isLoggedin, async function (req, res) {
    const products = await productmodel.find();
    const success= await req.flash("success");
    res.render("shop", { products,success });
});

router.get("/cart", isLoggedin, async function (req, res) {
    let user = await usermodel.findOne({email:req.user.email}).populate("cart");
    const REJ= await req.flash("REJ");
    res.render("cart",{user,REJ});
});

router.get("/cart/remove/:id", isLoggedin, async function (req, res) {
    const productId = req.params.id;
        let user = await usermodel.findOne({ email: req.user.email });
        user.cart = user.cart.filter((product) => product.toString() !== productId);
        await user.save();
        req.flash("REJ", "Remove from cart");
        res.redirect("/cart");
});

router.get("/addtocart/:id",isLoggedin,async function(req,res){
    let user= await usermodel.findOne({email:req.user.email});
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});

module.exports=router;