const express = require("express");
const app= express();
const cookieparser = require("cookie-parser");
const path = require("path");
const db= require("./config/mongoose-connection");
const ownersrouter=require("./routes/ownersrouter");
const usersrouter=require("./routes/usersrouter");
const productsrouter=require("./routes/productsrouter");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engin","ejs");

app.use("/owners",ownersrouter);
app.use("/users",usersrouter);
app.use("/products",productsrouter);

app.listen(3000);