const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")


//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));
//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs")
});
//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");

        return res.redirect("/listings");
    }
    console.log(listing);   
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/",  isLoggedIn,validateListing, wrapAsync(async (req, res, next) => {

    if (!req.body.listing.image?.url?.trim()) {
        delete req.body.listing.image;
    }
    const newlisting = new Listing(req.body.listing);
    // if(!newlisting.title){
    //     throw new ExpressError(404,"Title is missing !");
    // }
    // if(!newlisting.description){
    //     throw new ExpressError(404,"Title is description!");
    // }
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
}));
//edit route
router.get("/:id/edit",  isLoggedIn, isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })
}));
// UPDATE ROUTE 
router.put("/:id",  isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (req.body.listing.image?.url) {
        req.body.listing.image.url =
            req.body.listing.image.url.replace(/^"+|"+$/g, "").trim();
    }
    if (!req.body.listing.image?.url) {
        delete req.body.listing.image;
    }

    await Listing.findByIdAndUpdate(id, req.body.listing, {
        runValidators: true,
    });
    req.flash("success", "Listing Updated !")
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",  isLoggedIn,isOwner,async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings")
});
module.exports = router;