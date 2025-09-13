// basic requiresments
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expresserror.js");
const MongoStore = require('connect-mongo');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

//router requirements
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");


//setting mongoose
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("working");
})
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
}

//mongoose store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});


//setting sessions
const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


//basic set-ups
app.set("view engine" , "ejs");
app.set( "views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//res.locals for local vairable use
app.use((req,res,next) =>{
    res.locals.success =req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});

//using routers
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

//error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// error handler
app.use((err, req, res, next) =>{
    let{ statuscode =500 , message="something went wrong!"} = err;
    res.status(statuscode).render("error.ejs" , {message})
    
});

//listening verification
app.listen( 8080, () =>{
    console.log("listening to port:8080");
});
