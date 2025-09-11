import { User } from '@/models/User';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return Response.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Create user
    let user;
    try {
      user = await User.create({ name, email, password });
    } catch (err) {
      if (err.message === 'User already exists') {
        return Response.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        );
      } else {
        console.error('Error creating user:', err);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
      }
    }

    return Response.json(
      { success: true, user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration route error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
