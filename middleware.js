const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const ExpressError = require("./utils/expresserror.js");
const { reviewschema } = require("./schema.js");
const { listingschema } = require("./schema.js");



//to check is user is logged in 
module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

//creating sessions
module.exports.saveredirectUrl = (req, res, next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//checking for owner permissions
module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", " Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//validate database listing schema 
module.exports.validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

//validate database review schema
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};


// // checking for review author
module.exports.isreviewauthor = async (req, res, next) => {
    let { id,  reviewid } = req.params;
    let reviewaccess = await review.findById(reviewid);
    if (!reviewaccess.author.equals(res.locals.curruser._id)) {
        req.flash("error", " Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

