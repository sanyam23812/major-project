const express = require("express");
const router = express.Router({mergeParams:true });
const wrapasync = require("../utils/wrapasync");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validatereview, isLoggedin, isreviewauthor} = require("../middleware.js");


const reviewcontroller = require("../controllers/reviews.js");

//post route 
router.post("/", isLoggedin, validatereview, wrapasync(reviewcontroller.createreview));

//delete route 
router.delete("/:reviewid", isLoggedin, isreviewauthor, wrapasync(reviewcontroller.destroyreview));

module.exports = router;