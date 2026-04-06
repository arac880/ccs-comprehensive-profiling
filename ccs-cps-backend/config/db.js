const { MongoClient } = require("mongodb");

let cachedDb = null;

const connectDB = async () => {
  // If we already have a connection, don't create a new one
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = new MongoClient(process.env.MONGO_URI);

    // Connect to the Atlas cluster
    await client.connect();

    // Specify the database name
    const db = client.db("ccs_profiling_system");

    // Cache the connection
    cachedDb = db;

    console.log("Successfully connected to MongoDB Atlas!");
    return cachedDb;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // DO NOT use process.exit(1) on Vercel; it crashes the function.
    throw error;
  }
};

const getDB = () => {
  if (!cachedDb) {
    throw new Error("Database not initialized. Ensure connectDB is awaited.");
  }
  return cachedDb;
};

module.exports = { connectDB, getDB };
