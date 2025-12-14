const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    process.env.NODE_ENV === "test"
      ? process.env.MONGO_URI_TEST
      : process.env.MONGO_URI;

  await mongoose.connect(uri);
};

module.exports = connectDB;
