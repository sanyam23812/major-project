const mongoose = require('mongoose');
const schema = mongoose.Schema; 
// const review = require("./review.js");
const { string } = require('joi');

const listingschema = new schema({
    title: {
       type : String,
       required : true,
    },
    description: String,
    image : {

        filename: {
            type: String,
        },
        
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%33&auto=format&fit=crop&w=800&q=60",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%33&auto=format&fit=crop&w=800&q=60" : v,
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews: [{
        type : schema.Types.ObjectId,
        ref: "Reviews"
    }],
    owner: {
        type: schema.Types.ObjectId,
        ref :"User",
    },
});

listingschema.post("findOneAndDelete" , async(listing) =>{
    if(listing){
        const review = mongoose.model("Reviews");
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model("listing" , listingschema);
module.exports = listing;