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
  let sort = {};
  let filter = {};
  let products;

  // ✅ category filter first
  if (req.query.category) {
    switch (req.query.category) {
      case "casual":
        filter = { name: "CasualT" };
        break;
      case "polo":
        filter = { name: "PoloT" };
        break;
      case "style":
        filter = { name: "styleT" };
        break;
      case "printed":
        filter = { name: "T-type" };
        break;
      case "recommended":
        filter = {}; // all products
        break;
    }
  }
  if (req.query.gender) {
    filter = { ...filter, gender: req.query.gender };
  }
  // ✅ then apply sort if given
  switch (req.query.sort) {
    case "price-asc":
      sort = { price: 1 };
      products = await productmodel.find(filter).sort(sort);
      break;

    case "price-desc":
      sort = { price: -1 };
      products = await productmodel.find(filter).sort(sort);
      break;

    case "new":
      sort = { createdAt: -1 };
      products = await productmodel.find(filter).sort(sort);
      break;

    case "discount":
      filter = { ...filter, discount: { $gt: 0 } };
      products = await productmodel.find(filter);
      break;

    default:
      products = await productmodel.find(filter);
  }

  const success = await req.flash("success");
  res.render("shop", { products, success, req });
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