const { MongoClient } = require("mongodb");
require("dotenv").config();

let dbConnection;

const connectDB = async () => {
  try {
    // Initialize the MongoDB Client
    const client = new MongoClient(process.env.MONGO_URI);

    // Connect to the Atlas cluster
    await client.connect();

    // Specify the database name you want to use
    dbConnection = client.db("ccs_profiling_system");

    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

const getDB = () => {
  if (!dbConnection) {
    throw new Error("Call connectDB first!");
  }
  return dbConnection;
};

module.exports = { connectDB, getDB };
