const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const ExpressError = require("./utils/ExpressError.js");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
app.get("/", (req, res) => {
    res.send("Hi, I am root")
});

//require the listing , review file
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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