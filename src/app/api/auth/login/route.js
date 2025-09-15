// src/app/api/auth/login/route.js
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return Response.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Authenticate user
    let user;
    try {
      user = await User.authenticate(email, password);
    } catch (err) {
      // Handle authentication errors
      if (err.message === 'User not found' || err.message === 'Invalid password') {
        return Response.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      } else {
        console.error('Authentication error:', err);
        return Response.json(
          { success: false, message: 'Authentication failed' },
          { status: 500 }
        );
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Create a clean user object for the response
    const responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      token: token
    };
    
    // Explicitly serialize to ensure no circular references
    return new Response(JSON.stringify({
      success: true,
      user: responseUser
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Login route error:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}