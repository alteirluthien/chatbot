import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('chatbot'); // Use your actual database name
    
    // Clear users collection
    const usersResult = await db.collection('users').deleteMany({});
    console.log(`Cleared ${usersResult.deletedCount} users`);
    
    // Clear chats collection
    const chatsResult = await db.collection('user_chats').deleteMany({});
    console.log(`Cleared ${chatsResult.deletedCount} chat messages`);
    
    return Response.json({ 
      message: 'Database cleared successfully',
      usersDeleted: usersResult.deletedCount,
      chatsDeleted: chatsResult.deletedCount
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    return Response.json({ 
      error: 'Failed to clear database',
      details: error.message 
    }, { status: 500 });
  }
}