
const user = require("../models/user.js");

module.exports.rendersignup = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req,res) =>{
    try{
        let { username, email, password } = req.body;
        const newuser = new user({ email, username });
        const registereduser = await user.register(newuser, password);
        console.log(registereduser);
        req.login(registereduser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", " Welcome to BOOKYMYSTAY");
            res.redirect(res.locals.redirectUrl || "/listings");
        })
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
  
};

module.exports.renderlogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {

    req.flash("success", "Welcome Back to BOOKMYSTAY");
    res.redirect(res.locals.redirectUrl || "/listings");

};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};