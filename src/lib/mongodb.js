import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain a minimum of 5 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (uri.includes('<db_password>')) {
  throw new Error('Please replace <db_password> in MONGODB_URI with your actual database password');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;