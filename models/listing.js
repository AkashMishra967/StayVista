const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Review = require("./review.js");
const Schema = mongoose.Schema;


const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60";


const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,

    image:{
        url:{
            type:String,
            default:DEFAULT_IMAGE,
        },
        filename:{
            type:String,
            default:"listingimage",
        },
    
},
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete",async (listing) =>{
    if (listing){
    await Review.deleteMany({reviews:{$in: listing.reviews}})
    }
})


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;