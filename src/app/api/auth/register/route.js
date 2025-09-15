// src/app/api/auth/register/route.js
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validate input
    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Create user
    let user;
    try {
      user = await User.create({ name, email, password });
    } catch (err) {
      // Handle registration errors
      if (err.message === 'User already exists') {
        return Response.json(
          { success: false, message: 'A user with this email already exists' },
          { status: 409 }
        );
      } else if (err.message === 'Password must be at least 6 characters long') {
        return Response.json(
          { success: false, message: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      } else if (err.message === 'Invalid email format') {
        return Response.json(
          { success: false, message: 'Please enter a valid email address' },
          { status: 400 }
        );
      } else {
        console.error('Registration error:', err);
        return Response.json(
          { success: false, message: 'Registration failed' },
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
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Registration route error:', error);
    return Response.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}