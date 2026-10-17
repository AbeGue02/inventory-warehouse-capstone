/*
 * MongoDB connection utility file using Mongoose.
 * Ensures a single connection per API route and handles connection caching.
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// guard to ensure MONGODB_URI is set in the environment variables
if (!MONGODB_URI) {
  throw new Error("Please set variable MONGODB_URI in the .env file");
}

// Each API Route has its own mongoose instance
// Global instance caused issues with multiple API routes trying to share the same mongoose connection.
let connectPromise: Promise<typeof mongoose> | null = null;

// function to connect to the MongoDB database using the cached connection and promise
export async function connectDB() {
  // return the existing mongoose connection if it already exists
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // create a new mongoose connection
  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGODB_URI!).catch((error) => {
      connectPromise = null;
      throw error;
    });
  }

  await connectPromise;
  return mongoose;
}
