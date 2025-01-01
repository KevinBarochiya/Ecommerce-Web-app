const express= require("express");
const router=express.Router();
const ownermodel=require("../models/ownermodel");
const bcrypt=require("bcryptjs");
    router.get("/create",function(req,res){
        res.render("owner-login",{loggedin:false});
    });

    router.post("/create",async function(req,res){
    let o=await ownermodel.find();
    if(o.length===0){
       let {fullname,email,password}=req.body;
       const hashedPassword = await bcrypt.hash(password, 10);
       const createdOwner = await ownermodel.create({
           email,
           password: hashedPassword,
       });
       res.cookie("owner_id", createdOwner._id, { httpOnly: true });
       res.redirect("/owners/admin");
    }
    if(o.length===1){
        const { email, password } = req.body;
        const owner = await ownermodel.findOne({ email });
        if(!owner){
            return res.send("Something went wrong");
        }
        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.send("Something went wrong");
        }
        res.cookie("owner_id", owner._id, { httpOnly: true });
        res.redirect("/owners/admin");
    }
    if(o.length>1){
        res.send("Only one owner is allowed");
    }
    });

router.get("/admin", function (req, res) {
    const success = req.flash("success"); 
    res.render("createproducts", { success,loggedin:false});
});

module.exports=router;