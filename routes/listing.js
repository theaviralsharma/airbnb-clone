const Express = require("express");
const router = Express.Router();
const {validateSchema} = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");
const {isLoggedIn} = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
// const upload = multer({ dest: "uploads/" });

const {
  isOwner,
  isLoggedIntoEdit,
  isLoggedIntoDelete,
} = require("../middleware.js");

router.route("/")
//Index Route
.get(wrapAsync(listingController.index))
//Create Route
.post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateSchema,
  wrapAsync(listingController.create)
);

//New Route
router.get("/new", isLoggedIn, listingController.new);

router.route("/:id")
//Show Route
.get(wrapAsync(listingController.show))
//Update Route
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateSchema,
  wrapAsync(listingController.update)
)
//Delete Route
.delete(
  isLoggedIntoDelete,
  isOwner,
  wrapAsync(listingController.delete)
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIntoEdit,
  isOwner,
  wrapAsync(listingController.edit)
);

module.exports = router;

// // Test Route
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Sample Listing",
//     description: "This is a sample listing",
//     price: 100,
//     location: "Sample Location",
//     country: "Sample Country",
//   });

//   await sampleListing.save();
//   console.log("sample Listing created: ", sampleListing);
//   res.send("success");
// });
