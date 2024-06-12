const mongoose = require("mongoose");
const environemnt = require("dotenv").config();

try {
  mongoose.connect(process.env.MONGO_URL);
} catch (error) {
  console.log(error);
}
