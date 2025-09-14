import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function registerUser({ name, email, password }) {
  try {
    await dbConnect();

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) return { error: 'User already exists' };

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashed });

    return { success: true, user: { id: user._id, name: user.name, email: user.email } };
  } catch (err) {
    console.error('Registration error:', err.message);
    return { error: 'Internal server error' };
  }
}
