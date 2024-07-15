const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema , reviewSchema } = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    req.session.redirectUrl = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first to create a new listing");
        return res.redirect("/login");
     }
    next();
}

module.exports.isLoggedIntoEdit = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in first to edit this listing");
      return res.redirect("/login");
   }
  next();
}

module.exports.isLoggedIntoDelete = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in first to delete this listing");
      return res.redirect("/login");
   }
  next();
}

// console.log(req.path, req.originalUrl);
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  if (!listing.owner.equals(res.locals.loggedinUser._id)) {
    req.flash("error", "You do not have permission to do edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateSchema = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
      if (error) {
        console.log(error);
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
      } else {
        next();
      }
  };

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errorMsg = error.details.map((el) => el.message).join(",");
      return next(new ExpressError(400, errorMsg));
    }
    next();
  };

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.loggedinUser._id)) {
      req.flash("error", "You do not have permission to do delete this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
};