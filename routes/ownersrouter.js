const express= require("express");
const router=express.Router();
const ownermodel=require("../models/ownermodel");

if(process.env.NODE_ENV === "development"){
    router.post("/create",async function(req,res){
       let o=await ownermodel.find();
       if(o.length>0){
        return res.status(500).send("you not permition to create owner");
       }

       let {fullname,email,password}=req.body;
       let createdowner= await ownermodel.create({
        fullname,
        email,
        password,
       });
       res.status(201).send(createdowner);
       res.send('we can create new owner');
    });
}

router.get("/admin", function (req, res) {
    const success = req.flash("success"); 
    res.render("createproducts", { success });
});

module.exports=router;