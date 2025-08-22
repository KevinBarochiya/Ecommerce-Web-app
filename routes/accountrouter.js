const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const User = require("../models/usermodel");     
const Purchase = require("../models/purchase");   // ✅ fixed

// GET /account -> render account page
router.get("/", isLoggedin , async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const purchases = await Purchase.find({ userId: req.user.id })
      .populate("productId")
      .sort({ purchaseDate: -1 });

    // ✅ This renders views/account.ejs
    res.render("account", { user, purchases });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
