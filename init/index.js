const mongoose = require("mongoose");
const initData = require("./data.js")
const listing = require("../models/listing.js");
// const User = require("../models/user.js");


main().then( () =>{
    console.log ("working");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/BOOK-MY-STAY');
}


const initdb = async() => {
   await listing.deleteMany({});
    initData.data = initData.data.map((obj) =>
     ({ ...obj , owner : "68c48bf30b2ef18da21dca1e"}));
   await listing.insertMany(initData.data);
   console.log("data is there");
};


initdb();