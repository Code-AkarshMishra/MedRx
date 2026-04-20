const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI missing in .env");
  }

  await mongoose.connect(mongoUri);
  const dbName = mongoose.connection.db?.databaseName ?? "default";
  console.log(`MongoDB connected (database: ${dbName})`);
};

module.exports = connectDB;
