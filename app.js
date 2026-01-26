const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

main()
    .then((res) => {
        console.log("connected DB");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}
// home route
app.get("/",(req,res)=>{
    res.send("Hi, I am root")
});

const validateListing = (req,res,next) =>{
 let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) =>el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

};

//review schema ke liye 
const validateReview = (req,res,next) =>{
 let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) =>el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

};

//index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));
//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})
//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));
//create route
app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {

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
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}));

// UPDATE ROUTE ✅
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
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
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings")
});
//Reviews post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res) =>{
     console.log("BODY 👉", req.body)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));


// app.get("/testlisting", async(req,res) =>{
//     let samplelisting = new Listing ({
//         title: "My Villa",
//         description:"By the beach",
//         price: 1200,
//         location:"Calangute,Goa",
//         country:"India"
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successfull");
// });

// midleware

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen("8080", (req, res) => {
    console.log("port is running now")
});