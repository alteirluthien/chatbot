import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function loginUser({ email, password }) {
  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) return { error: 'User not found' };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return { error: 'Incorrect password' };

    return { success: true, user: { id: user._id, name: user.name, email: user.email } };
  } catch (err) {
    console.error('Login error:', err.message);
    return { error: 'Internal server error' };
  }
}
