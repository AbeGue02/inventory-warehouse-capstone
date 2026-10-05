/**
 * API route for registering a new user.
 */
import User from "@/models/User";
import { connectDB } from "@/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Handles user registration requests.
// POST /api/signup
export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, username, password } = await request.json();
    if (!name || !email || !username || !password) {
      // Guard against missing required fields.
      return Response.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      // Check if a user with the same username or email already exists.
      return Response.json(
        { error: "Username or email already in use" },
        { status: 409 },
      );
    }
    const user = await User.create({
      name,
      email,
      username,
      password: await bcrypt.hash(password, 10),
    });
    const token = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // Return the JWT token and user info on successful registration.
    return Response.json(
      { token, user: { id: user._id, username: user.username } },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST /api/signup failed:", err);
    return Response.json({ error: "Failed to sign up" }, { status: 500 });
  }
}
