
const axios = require("axios");

const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    let query = {};
    let filters = [];

    if (req.query.country && req.query.country.trim() !== "") {
        filters.push({
            country: new RegExp(req.query.country, "i"),
        });
    }

    if (req.query.city && req.query.city.trim() !== "") {
        filters.push({
            location: new RegExp(req.query.city, "i"),
        });
    }

    if (filters.length > 0) {
        query.$and = filters;
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");

        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
});




module.exports.createlisting = async (req, res) => {
  try {
    let url = req.file?.path;
    let filename = req.file?.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (url && filename) {
      newListing.image = { url, filename };
    }

    // 🌍 FREE OpenStreetMap Geocoding
    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: req.body.listing.location, // ✅ CORRECT
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "stayvista-app",
        },
      }
    );

    if (!geoRes.data.length) {
      req.flash("error", "Invalid location");
      return res.redirect("/listings/new");
    }

    const lat = parseFloat(geoRes.data[0].lat);
    const lng = parseFloat(geoRes.data[0].lon);

    // 📍 SAVE CORRECT GEOMETRY
    newListing.geometry = {
      type: "Point",
      coordinates: [lng, lat], // GeoJSON rule
    };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings/new");
  }
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
let originalImageUrl = listing.image.url;
originalImageUrl =originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs", { listing ,originalImageUrl})
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    if (req.body.listing.image?.url) {
        req.body.listing.image.url =
            req.body.listing.image.url.replace(/^"+|"+$/g, "").trim();
    }
    if (!req.body.listing.image?.url) {
        delete req.body.listing.image;
    }

   let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
        runValidators: true,
    });


  // ✅ 👉 YAHIN PASTE KARO (EXACT PLACE)
  if (req.body.listing.geometry) {
    listing.geometry = {
      type: "Point",
      coordinates: [
        req.body.listing.geometry.coordinates[0],
        req.body.listing.geometry.coordinates[1],
      ],
    };
    await listing.save();
  }

if(typeof req.file !== "undefined"){
    let url = req.file.path;
let filename = req.file.filename;
listing.image = {url, filename};
await listing.save();
}
    req.flash("success", "Listing Updated !")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings")
}
