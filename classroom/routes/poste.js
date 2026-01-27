const express = require("express");
// router object
const router = express.Router();

//index user
router.get("/",(req,res) =>{
    res.send("get for posts");
});
//show user
router.get("/:id",(req,res) =>{
    res.send("get for post id");
});
//post user
router.get("/",(req,res) =>{
    res.send("post for posts");
});
//delete user
router.get("/:id",(req,res) =>{
    res.send("delete for posts id");
});

module.exports = router;