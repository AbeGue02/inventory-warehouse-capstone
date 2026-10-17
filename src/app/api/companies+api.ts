/*
 * API route for companies in the Inventory Warehouse database.
 * Uses Expo Server as the backend to handle requests.
 */
import { getUserId, unauthorized } from "@/auth";
import Company from "@/models/Company";
import { connectDB } from "@/mongodb";

// Lists the companies the authenticated user belongs to.
// GET /api/companies
export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();
  try {
    await connectDB();
    const companies = await Company.find({
      $or: [{ admins: userId }, { employees: userId }],
    }).select("name slug");
    return Response.json(companies);
  } catch (err) {
    console.error("GET /api/companies failed:", err);
    return Response.json(
      { error: "Failed to fetch companies" },
      { status: 500 },
    );
  }
}

// Creates a company with the authenticated user as admin.
// POST /api/companies
export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();
  try {
    await connectDB();
    const { name } = await request.json();
    if (!name?.trim()) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    const slug = `${name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
    const company = await Company.create({
      name: name.trim(),
      slug,
      admins: [userId],
    });
    return Response.json(
      { _id: company._id, name: company.name, slug: company.slug },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST /api/companies failed:", err);
    return Response.json(
      { error: "Failed to create company" },
      { status: 500 },
    );
  }
}
