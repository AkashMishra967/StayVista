const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename:{
        type:String,
        default:"listingimage"
        },
        url:{
            type:String,
        default:
            " https://pixabay.com/photos/nature-waters-lake-island-3082832/ ",
        set:(v) => v === "" 
        ? " https://pixabay.com/photos/nature-waters-lake-island-3082832/ "
        : v,
    }
},
    price:Number,
    location:String,
    country:String,
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;