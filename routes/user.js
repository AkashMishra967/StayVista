const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport");

router.get("/signup",(req,res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res) =>{
    try{
    let{username, email,password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listings");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));

//login ke liye
router.get("/login",(req,res) =>{
    res.render("users/login.ejs");
})

//post route
//passport.authenticate ye ek middleware kaam kare ga ki user pahale se to rigister nhi hai
router.post("/login", passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}),async(req,res) =>{
req.flash("Success","welcome to back wanderlust !");
res.redirect("/listings");
})




module.exports = router;