const Listing = require("../models/listing.js");
const review = require("../models/review.js");


module.exports.createreview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;

    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyreview = async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewid } });
    await review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Delete!");
    res.redirect(`/listings/${id}`);
};