const express = require("express");
// router object
const router = express.Router();

//index user
router.get("/",(req,res) =>{
    res.send("get for user");
});
//show user
router.get("/:id",(req,res) =>{
    res.send("get for user id");
});
//post user
router.get("/",(req,res) =>{
    res.send("post for user");
});
//delete user
router.get("/:id",(req,res) =>{
    res.send("delete for user id");
});

module.exports = router;