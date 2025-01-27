const express = require("express");
const isLoggedin = require("../middlewares/isLoggedin");
const router= express.Router();
const productmodel=require("../models/productmodel");
const usermodel = require("../models/usermodel");
const Purchase = require('../models/purchase');

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
        const user = await usermodel.findOne({ email: req.user.email });
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
router.post('/buy/:productId',isLoggedin, async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productmodel.findById(productId);  // Correct reference to product model
        const userId = await usermodel.findOne({ email: req.user.email });
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Create a new purchase
        const newPurchase = new Purchase({
            userId,
            productId,
            quantity: 1,
            totalPrice: product.price - product.discount  // Consider the discount while calculating price
        });

        await newPurchase.save();

        // Add to user's orders (optional, depending on your business logic)
        const user = await usermodel.findById(userId);
        user.orders.push(newPurchase);
        await user.save();

        res.redirect('/cart');  // Redirect to cart page after purchase
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports=router;