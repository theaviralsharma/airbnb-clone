const Express = require("express");
const router = Express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const registerController = require("../controllers/registers");

router.route("/signup")
.get(wrapAsync(registerController.renderSignup))
.post(wrapAsync(registerController.signup));

router.route("/login")
.get(wrapAsync(registerController.renderLogin))
.post(saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),wrapAsync(registerController.login));

router.get("/logout",wrapAsync(registerController.logout));

module.exports = router;
