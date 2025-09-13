// src/app/api/auth/login/route.js
import User from '@/models/User';  // Fixed: default import
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return Response.json({ 
        success: false, 
        error: "Email and password are required" 
      }, { status: 400 });
    }
    
    console.log('Login attempt for email:', email);
    const user = await User.authenticate(email, password);
    console.log('Authentication result:', user);
    
    if (!user) {
      return Response.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return Response.json({ 
      success: true, 
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email,
        token: token
      } 
    }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}