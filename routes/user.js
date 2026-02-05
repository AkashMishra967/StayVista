const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.signup));

router.route("/login")
//login ke liye
.get(userController.renderLoginForm)
//passport.authenticate ye ek middleware kaam kare ga ki user pahale se to rigister nhi hai
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}),userController.login);

//logout route
router.get("/logout",userController.logout);
module.exports = router;