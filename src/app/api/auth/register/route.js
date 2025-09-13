// src/app/api/auth/register/route.js
import User from '@/models/User';  // Fixed: default import
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    // Trim inputs to remove extra spaces
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    
    console.log('Registration attempt:', { name: trimmedName, email: trimmedEmail });
    
    if (!trimmedName || !trimmedEmail || !password) {
      return Response.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return Response.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return Response.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Create user with sanitized data
    let user;
    try {
      user = await User.create({ 
        name: trimmedName, 
        email: trimmedEmail, 
        password 
      });
    } catch (err) {
      if (err.message === 'User already exists') {
        return Response.json(
          { success: false, error: 'A user with this email already exists' },
          { status: 409 }
        );
      } else {
        console.error('Error creating user:', err);
        return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return Response.json(
      { 
        success: true, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          token: token
        } 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration route error:', error);
    return Response.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}