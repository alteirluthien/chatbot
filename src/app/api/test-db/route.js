import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    const client = await clientPromise;
    console.log('Connected to MongoDB client');
    
    const db = client.db('college_enquiry');
    console.log('Connected to college_enquiry database');
    
    // Try to ping the database
    await db.admin().ping();
    console.log('Database ping successful');
    
    // Try to list collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);
    
    return Response.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      collections: collections.map(c => c.name)
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