const mongoose = require("mongoose");

const connectDB = async () => {
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
