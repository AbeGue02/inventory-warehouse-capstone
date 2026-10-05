/**
 * API route for items in the Inventory Warehouse database.
 * Uses Expo Server as the backend to handle requests.
 * All handlers require a Bearer token and being part of a company.
 */
import { forbidden, getUserId, isCompanyMember, unauthorized } from "@/auth";
import Item from "@/models/Item";
import { connectDB } from "@/mongodb";

// Fetches the items of a company.
// GET /api/items?company=:companyId
export async function GET(request: Request) {
  const userId = getUserId(request); // Get the ID of the authenticated user from the request.
  if (!userId) return unauthorized(); // Return 401 Unauthorized if the user is not authenticated.
  try {
    await connectDB();
    const companyId = new URL(request.url).searchParams.get("company");
    if (!companyId) {
      // Guard against missing company ID in the request.
      return Response.json(
        { error: "Company ID is required" },
        { status: 400 },
      );
    }
    if (!(await isCompanyMember(userId, companyId))) return forbidden(); // Return 403 Forbidden if the user is not part of the company.
    const items = await Item.find({ company: companyId });
    return Response.json(items);
  } catch (err) {
    console.error("GET /api/items failed:", err);
    return Response.json(
      {
        error: "Failed to fetch items",
        detail: err instanceof Error ? err.message : String(err), // Include error details for debugging
      },
      { status: 500 },
    );
  }
}

// Creates a new item in a company.
// POST /api/items
export async function POST(request: Request) {
  const userId = getUserId(request); // Get the ID of the authenticated user from the request.
  if (!userId) return unauthorized(); // Return 401 Unauthorized if the user is not authenticated.
  try {
    await connectDB();
    const { name, sku, quantity, company } = await request.json();
    if (!company || !(await isCompanyMember(userId, company))) {
      // Return 403 Forbidden if the user is not part of the company.
      return forbidden();
    }
    const newItem = await Item.create({ name, sku, quantity, company });
    return Response.json(newItem, { status: 201 });
  } catch (err) {
    console.error("POST /api/items failed:", err);
    return Response.json({ error: "Failed to create item" }, { status: 500 });
  }
}

// Updates an existing item.
// PUT /api/items?id=:id
export async function PUT(request: Request) {
  const userId = getUserId(request); // Get the ID of the authenticated user from the request.
  if (!userId) return unauthorized(); // Return 401 Unauthorized if the user is not authenticated.
  try {
    await connectDB();
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return Response.json({ error: "Item ID is required" }, { status: 400 });
    }
    const existing = await Item.findById(id);
    if (!existing) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }
    if (!(await isCompanyMember(userId, existing.company.toString()))) {
      return forbidden(); // Return 403 Forbidden if the user is not part of the company.
    }
    const { name, sku, quantity } = await request.json();
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, sku, quantity },
      { new: true },
    );
    return Response.json(updatedItem);
  } catch (err) {
    console.error("PUT /api/items failed:", err);
    return Response.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// Removes an item.
// DELETE /api/items?id=:id
export async function DELETE(request: Request) {
  const userId = getUserId(request); // Get the ID of the authenticated user from the request.
  if (!userId) return unauthorized(); // Return 401 Unauthorized if the user is not authenticated.
  try {
    await connectDB();
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return Response.json({ error: "Item ID is required" }, { status: 400 });
    }
    const existing = await Item.findById(id);
    if (!existing) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }
    if (!(await isCompanyMember(userId, existing.company.toString()))) {
      return forbidden(); // Return 403 Forbidden if the user is not part of the company.
    }
    await existing.deleteOne();
    return Response.json(existing);
  } catch (err) {
    console.error("DELETE /api/items failed:", err);
    return Response.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
