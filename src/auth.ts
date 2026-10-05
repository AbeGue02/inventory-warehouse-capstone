/**
 * Server side helper functions for authenticating API requests and checking company access.
 */
import Company from "@/models/Company";
import jwt from "jsonwebtoken";

// Returns the user ID from the request's token or null if missing/invalid.
export function getUserId(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!);
    return typeof payload === "object" && payload.sub
      ? String(payload.sub)
      : null;
  } catch {
    return null;
  }
}

// Returns true if the user is an admin or employee of the company.
export async function isCompanyMember(userId: string, companyId: string) {
  if (!/^[a-f\d]{24}$/i.test(companyId)) return false; // Invalid company ID format.
  const company = await Company.exists({
    _id: companyId,
    $or: [{ admins: userId }, { employees: userId }], // Check if the user is an admin or employee.
  });
  return company !== null;
}

// Returns a 401 Unauthorized response.
export const unauthorized = () =>
  Response.json({ error: "Unauthorized" }, { status: 401 });

// Returns a 403 Forbidden response.
export const forbidden = () =>
  Response.json({ error: "Forbidden" }, { status: 403 });
