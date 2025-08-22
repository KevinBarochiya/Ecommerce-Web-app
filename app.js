const express = require("express");
const app= express();
const cookieparser = require("cookie-parser");
const path = require("path");
const db= require("./config/mongoose-connection");
const ownersrouter=require("./routes/ownersrouter");
const usersrouter=require("./routes/usersrouter");
const productsrouter=require("./routes/productsrouter");
const accountrouter = require("./routes/accountrouter");
const expressSession =require("express-session");
const flash=require("connect-flash");
const indexRouter=require("./routes/index")
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret:process.env.SECRET
    })
);
app.use(flash());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

app.use("/",indexRouter);
app.use("/owners",ownersrouter);
app.use("/users",usersrouter);
app.use("/products",productsrouter);
app.use("/account",accountrouter);

app.listen(process.env.PORT);