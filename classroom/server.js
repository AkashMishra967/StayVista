const mongoose = require("mongoose");
const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/poste.js");
// npm cookie-parse
const cookieParser = require("cookie-parser");

//cookieparse middleware
app.use(cookieParser("secretcode"));

app.get("/getsignedcookie",(req,res) =>{
    res.cookie("made-in","India",{signed:true});
    res.send("signed cookie sent");
});

app.get("/verify",(req,res) =>{
    console.log(req.signedCookies);
    res.send("verified");
});









app.get("/getcookies",(req,res) =>{
    res.cookie("great","hello");
    res.cookie("median","India");
    res.send("sent you some cookies");
});

app.get("/great",(req,res) =>{
    let ( name = "anonynous") = req.cookies;
    res.send(`Hi,${name}`);
});


app.get("/",(req,res) =>{
    console.dir(req.cookies);
    res.send("Hi am cookie");
});





app.use("/users",users);
app.use("/posts",posts);

app.get("/server",(req,res) =>{
    res.send("welcome to you");
});

app.listen(3000,(req,res)=>{
    console.log("port is running 3000");
});