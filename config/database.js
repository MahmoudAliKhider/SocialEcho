const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL environment variable is not set.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
    process.exit(1); // Terminate the application if unable to connect to the database
  }
};

module.exports = connectDB;
