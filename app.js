if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const lisitngs = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const register = require("./routes/register.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ATLAS_URL = process.env.ATLAS_URL;


// Middleware for logging requests
// app.use((req, res, next) => {
//   console.log(`Received request: ${req.method} ${req.url}`);
//   next();
// });

// Change: async main function now includes a console log for successful connection
async function main() {
  await mongoose.connect(ATLAS_URL);
  console.log("Connected to DB");
}

main().catch((err) => console.log(err)); // Moved .catch to main function call

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: ATLAS_URL,
  touchAfter: 24 * 60 * 60,
  crypto : {
    secret: process.env.SECRET,
  }
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionConfig = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  
  cookie: {
    // Ref: https://www.npmjs.com/package/express-session#store
    httpOnly: true, // JS cannot access the cookie on the client side
    secure: false, // cookie only sent over HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};

app.get("/",(req, res) => {
  res.redirect("/listings");
});



app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // how to authenticate a user
passport.serializeUser(User.serializeUser()); // how to store a user in a session
passport.deserializeUser(User.deserializeUser()); // how to get a user out of a session


app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.loggedinUser = req.user;
  next();
});

app.use("/listings", lisitngs);
app.use("/listings/:id/reviews", reviews);
app.use("/", register);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!😂"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong!!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message, statusCode });
  // res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("server is listening to port 3000");
});
