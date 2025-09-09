import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("chatbot");

    // Find the user
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return Response.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Login successful
    return Response.json(
      { success: true, userId: user._id, name: user.name },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
