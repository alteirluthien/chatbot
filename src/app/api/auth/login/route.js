import { User } from '../../../../models/user';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await User.authenticate(email, password);
    
    if (!user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data (without password)
    return Response.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message && error.message.includes('<db_password>')) {
      return Response.json(
        { error: 'Database configuration error: Please replace <db_password> with your actual MongoDB password' },
        { status: 500 }
      );
    }

    if (error.name === 'MongoServerSelectionError') {
      return Response.json(
        { error: 'Unable to connect to database. Please check your MongoDB connection string and network.' },
        { status: 500 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}