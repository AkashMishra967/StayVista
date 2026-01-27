const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
//joi middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }

};

//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));
//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})
//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {

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
    await newlisting.save();
    res.redirect("/listings");
}));
//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}));
// UPDATE ROUTE 
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
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
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings")
});
module.exports = router;