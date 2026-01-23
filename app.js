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


app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));


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
//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
});
//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})
//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});
//create route
app.post("/listings", async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});
//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
});
//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings")
});


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

app.listen("8080", (req, res) => {
    console.log("port is running now")
});