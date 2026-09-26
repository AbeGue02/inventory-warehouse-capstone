/**
 * API route for items in the Inventory Warehouse database.
 * Uses Expo Server as the backend to handle requests.
 */
import Item from "@/models/Item";
import { connectDB } from "@/mongodb";

// GET handler for fetching all items from the database
// GET /api/items
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

// POST handler for creating a new item in the database
// POST /api/items
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newItem = new Item(body);
    await newItem.save();
    return Response.json(newItem, { status: 201 });
  } catch (err) {
    console.error("POST /api/items failed:", err);
    return Response.json({ error: "Failed to create item" }, { status: 500 });
  }
}
