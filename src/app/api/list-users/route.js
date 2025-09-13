// src/app/api/list-users/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('college_enquiry');
    const users = await db.collection('users').find({}).toArray();
    
    // Remove password field for security
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return Response.json({ users: usersWithoutPasswords });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}