const express = require("express");
const isLoggedin = require("../middlewares/isLoggedin");
const router= express.Router();
const productmodel=require("../models/productmodel");
const usermodel = require("../models/usermodel");
const Purchase = require('../models/purchase');

router.get("/",function(req,res){
    let error= req.flash("error");
    let success= req.flash("success");
    res.render("index",{error,loggedin:false,success});
});

router.get("/shop", isLoggedin, async function (req, res) {
  try {
    let sort = {};
    let filter = {};

    // ====== Filters ======
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
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.size) filter.size = req.query.size;
    
    // ====== Sorting ======
    switch (req.query.sort) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "new":
        sort = { createdAt: -1 };
        break;
      case "discount":
        filter.discount = { $gt: 0 };
        break;
      default:
        break;
    }

    // ====== Pagination ======
    const page = parseInt(req.query.page) || 1; // current page
    const limit = 4; // products per page
    const skip = (page - 1) * limit;

    const products = await productmodel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await productmodel.countDocuments(filter); // for pagination

    const success = await req.flash("success");
    res.render("shop", { 
      products, 
      success, 
      req, 
      currentPage: page, 
      totalPages: Math.ceil(total / limit) 
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


router.get("/cart", isLoggedin, async function (req, res) {
    let user = await usermodel.findOne({email:req.user.email}).populate("cart");
    const REJ= await req.flash("REJ");
    const ABC= await req.flash("ABC");
    res.render("cart",{user,REJ,ABC});
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
router.post('/buy/:productId', isLoggedin, async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productmodel.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Get the user document directly
        const user = await usermodel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Create a new purchase
        const newPurchase = new Purchase({
            userId: user._id,
            productId,
            quantity: 1,
            totalPrice: product.price - (product.discount || 0)
        });

        await newPurchase.save();

        // Add to user's orders
        user.orders.push(newPurchase);
        user.cart = user.cart.filter(item => item._id.toString() !== productId);
        await user.save();

        req.flash('ABC', 'Item bought successfully!');
        res.redirect('/cart');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



router.post('/buy-all', isLoggedin, async (req, res) => {
    try {
        const user = await usermodel.findOne({ email: req.user.email }).populate('cart');
        if (!user.cart || user.cart.length === 0) {
            req.flash('ABC', 'Your cart is empty');
            return res.redirect('/cart');
        }

        for (const item of user.cart) {
            const product = await productmodel.findById(item._id);
            if (!product) continue; // skip if product not found

            const newPurchase = new Purchase({
                userId: user._id,
                productId: product._id,
                quantity: 1, // or item.quantity if you store quantity in cart
                totalPrice: product.price - (product.discount || 0)
            });

            await newPurchase.save();
            user.orders.push(newPurchase);
        }

        // Clear the cart after purchase
        user.cart = [];
        await user.save();

        req.flash('ABC', 'All items bought successfully!');
        res.redirect('/cart');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports=router;