const express = require("express");
const app= express();
const cookieparser = require("cookie-parser");
const path = require("path");
const db= require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engin","ejs");


app.get("/",function(req,res){
    res.send('hey');
});

app.listen(3000);