import { User } from '../../../../models/User'; // 4 levels up from register folder

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Create user in MongoDB
    const user = await User.create({ name, email, password });

    return Response.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.message === 'User already exists') {
      return Response.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
;