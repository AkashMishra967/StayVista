const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing.js");
const initdata = require("./data.js");
main()
.then((res) =>{
    console.log("connected DB");
})
.catch((err) =>{
    console.log(err);
});
 async function main() {
    await mongoose.connect(MONGO_URL);
 }
 const initDB = async () =>{
await Listing.deleteMany({});
await Listing.insertMany(initdata.data);
console.log("data was initialized");
 };

 initDB();