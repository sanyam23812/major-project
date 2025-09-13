const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
};

module.exports.rendernewform = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res, next) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate({path:"reviews" , populate:{path:"author",},}).populate("owner");
        if(!listing){
            req.flash("error", "Listing does not exist!");
           return res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs", { listing }); 
};

module.exports.createlisting = async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.rendereditform = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });

};

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);

};

module.exports.destroylisting = async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
};