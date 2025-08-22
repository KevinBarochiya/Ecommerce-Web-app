const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
  image: Buffer,
  name: String,
  price: Number,
  discount: {
    type: Number,
    default: 0
  },
  bgcolor: String,
  panelcolor: String,
  textcolor: String,

  // ✅ Add gender field
  gender: {
    type: String,
    enum: ["male", "female", "unisex"], // restrict values
    default: "unisex"
  }
});

module.exports = mongoose.model("product", productschema);
