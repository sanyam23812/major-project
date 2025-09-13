const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");


const usercontroller = require("../controllers/users.js");

router
.route("/signup")
    .get( usercontroller.rendersignup)
    .post( wrapasync(usercontroller.signup)
);

router
    .route("/login")
    .get( usercontroller.renderlogin)
    .post(
        saveredirectUrl,
        passport.authenticate("local",
            { failureRedirect: "/login", failureFlash: true }), usercontroller.login
);

//log out page 
router.get("/logout" , usercontroller.logout);

module.exports = router;