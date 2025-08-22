const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productmodel = require("../models/productmodel");
const flash = require("connect-flash");

router.post("/create", upload.single("image"), async function (req, res) {
  try {
    let { name, price, discount, bgcolor, panelcolor, textcolor, gender, brand, size } = req.body;

    // Ensure size is always an array (multi-select)
    let sizes = size;
    if (!Array.isArray(sizes)) {
      sizes = [sizes];
    }

    let product = await productmodel.create({
      image: req.file ? req.file.buffer : null, // ✅ safe access
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      gender,
      brand,
      size: sizes,
    });

    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});

module.exports = router;
