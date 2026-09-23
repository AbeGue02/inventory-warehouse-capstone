/**
 * API route for items in the Inventory Warehouse database.
 * Uses Expo Server as the backend to handle requests.
 */
import Item from "@/models/Item";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; // MongoDB connection URI from .env file

// Guard statement for missing MongoDB connection URI in the environment variables
if (!MONGODB_URI) {
  throw new Error(
    "Please write MONGODB_URI environment variable inside .env file",
  );
}

// Type declaration for the global cached mongoose connection
// We do this to make sure the cached mongoose connection caches and
// reuses the connection instead of refreshing after every request
declare global {
  var _mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

// Initialize the cached mongoose connection from the global object
let cached = globalThis._mongoose ?? { conn: null, promise: null };

// Function to connect to the MongoDB database using the cached connection
export async function connectDB() {
  // readyState 1 = connected, 2 = connecting — both are safe to reuse
  if (cached.conn && [1, 2].includes(mongoose.connection.readyState)) {
    return cached.conn;
  }

  cached.conn = null;
  cached.promise = null; // force a fresh connect attempt

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  globalThis._mongoose = cached;
  console.log("MongoDB connected");
  return cached.conn;
}

async function getData() {
  return [
    { name: "Item 1", sku: "SKU1", quantity: 10 },
    { name: "Item 2", sku: "SKU2", quantity: 5 },
    { name: "Item 3", sku: "SKU3", quantity: 8 },
    { name: "Item 4", sku: "SKU4", quantity: 12 },
    { name: "Item 5", sku: "SKU5", quantity: 7 },
    { name: "Item 6", sku: "SKU6", quantity: 3 },
    { name: "Item 7", sku: "SKU7", quantity: 9 },
    { name: "Item 8", sku: "SKU8", quantity: 4 },
    { name: "Item 9", sku: "SKU9", quantity: 6 },
    { name: "Item 10", sku: "SKU10", quantity: 11 },
    { name: "Item 11", sku: "SKU11", quantity: 2 },
    { name: "Item 12", sku: "SKU12", quantity: 14 },
    { name: "Item 13", sku: "SKU13", quantity: 5 },
    { name: "Item 14", sku: "SKU14", quantity: 8 },
    { name: "Item 15", sku: "SKU15", quantity: 10 },
  ];
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const items = await Item.find();
    return Response.json(items);
  } catch (err) {
    console.error("GET /api/items failed:", err);
    return Response.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
