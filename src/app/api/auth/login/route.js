import { User } from '@/models/User';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.authenticate(email, password);

    if (!user) {
      return Response.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    return Response.json({ success: true, userId: user._id, name: user.name }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
