const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Change: async main function now includes a console log for successful connection
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  }
  
  main().catch((err) => console.log(err)); // Moved .catch to main function call

  const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({ ...obj, owner: "6692e4ef8e082f5a700d2983" }));
    await Listing.insertMany(initData.data);
    console.log("Data initialized initDB");
  };

initDB()
.then(() => console.log("Data initialized"))
.catch((err) => console.log(err)); // Moved .catch to initDB function call