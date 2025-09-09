import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // ✅ Validate input
    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Success
    return Response.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
