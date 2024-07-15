const User = require("../models/user");

module.exports.renderSignup = async (req, res) => {
    res.render("listings/users/signup.ejs");
  };

module.exports.signup = async (req, res, next) => {
    try {
      let { email, username, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Registered Successfully, Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

module.exports.renderLogin = async (req, res) => {
    try {
      res.render("listings/users/login.ejs");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/login");
    }
  };

module.exports.login = async (req, res) => {
    // res.send("Logged In");
    req.flash("success", "Welcome Back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

module.exports.logout = async (req, res, next) => {
    req.logout((err) => {
      if (err) return next;
      req.flash("success", "Logged Out Successfully!!!");
      res.redirect("/listings");
    });
  };
