const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner, validatelisting}= require("../middleware.js");


//require controller
const listingcontroller = require("../controllers/listings.js");

//new listing
router.get("/new", isLoggedin, listingcontroller.rendernewform);

router
 .route("/")
 .get( wrapasync(listingcontroller.index))
 .post( isLoggedin, validatelisting, wrapasync(listingcontroller.createlisting)
);

//edit route
router.get("/:id/edit", isLoggedin, wrapasync(listingcontroller.rendereditform));



router
 .route("/:id")
 .get( wrapasync(listingcontroller.showlisting))
    .put( isLoggedin, isOwner, validatelisting, wrapasync(listingcontroller.updatelisting))
    .delete ( isLoggedin, isOwner, wrapasync(listingcontroller.destroylisting)
);



module.exports = router;