const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.DBURL, {
    autoCreate: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log("Error connection database ", err);
  });
