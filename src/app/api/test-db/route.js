// src/app/api/test-db/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    const client = await clientPromise;
    console.log('Connected to MongoDB client');
    
    const db = client.db('chatbot'); // Use your actual database name
    console.log('Connected to chatbot database');
    
    // Try to ping the database
    await db.admin().ping();
    console.log('Database ping successful');
    
    // Try to list collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);
    
    // Get user count
    const usersCount = await db.collection('users').countDocuments();
    console.log('Users count:', usersCount);
    
    // Get chats count
    const chatsCount = await db.collection('user_chats').countDocuments();
    console.log('Chats count:', chatsCount);
    
    return Response.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      database: 'chatbot',
      collections: collections.map(c => c.name),
      stats: {
        usersCount,
        chatsCount
      }
    });
    
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    let errorMessage = 'Unknown database error';
    let errorType = 'unknown';
    
    if (error.name === 'MongoServerSelectionError') {
      errorMessage = 'Unable to connect to MongoDB server. Check connection string and network.';
      errorType = 'connection';
    } else if (error.message && error.message.includes('authentication failed')) {
      errorMessage = 'MongoDB authentication failed. Check username and password.';
      errorType = 'auth';
    } else if (error.message && error.message.includes('SSL')) {
      errorMessage = 'SSL/TLS connection error. This might be a network or authentication issue.';
      errorType = 'ssl';
    }
    
    return Response.json({
      success: false,
      error: errorMessage,
      type: errorType,
      details: error.message
    }, { status: 500 });
  }
}