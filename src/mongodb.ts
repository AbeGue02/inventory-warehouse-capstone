// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// guard to ensure MONGODB_URI is set in the environment variables
if (!MONGODB_URI) {
  throw new Error("Please set variable MONGODB_URI in the .env file");
}

// Type for caching the mongoose connection and promise
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// declare a global variable to cache the mongoose connection and promise
declare global {
  var _mongoose: MongooseCache | undefined;
}

// initialize the cached variable with the global mongoose cache
const cached = (globalThis._mongoose ??= {
  conn: null,
  promise: null,
});

// function to connect to the MongoDB database using the cached connection and promise
export async function connectDB() {
  // return the existing mongoose connection if it already exists
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // create a new mongoose connection if it doesn't exist in the cache
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).catch((error) => {
      // if an error occurs while connecting, reset the cache and rethrow the error
      // I rethrow the error to ensure the parent function is aware of the failure
      cached.conn = null;
      cached.promise = null;
      throw error;
    });
  }

  // wait for the mongoose connection to be established and cache it
  cached.conn = await cached.promise;
  cached.promise = null;
  return cached.conn;
}
