/**
 * API route for users in the Inventory Warehouse database.
 * Uses Expo Server as the backend to handle requests.
 */

import User from "@/models/User";
import { connectDB } from "@/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Handles user login by verifying credentials and returning a JWT token.
// POST /api/users
export async function POST(request: Request) {
  await connectDB();
  const { username, password } = await request.json();
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    // Return 401 Unauthorized if the credentials are invalid.
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );
  return Response.json({
    token,
    user: { id: user._id, username: user.username },
  });
}
