// src/models/User.js
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import clientPromise from '../lib/mongodb';

class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt || new Date();
  }

  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('chatbot');
    return db.collection('users');
  }

  static async findByEmail(email) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email: email.toLowerCase() });
    // Return null or a plain object without MongoDB-specific properties
    return user ? JSON.parse(JSON.stringify(user)) : null;
  }

  static async create(userData) {
    const collection = await this.getCollection();
    
    // Check if user already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Validate password length
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = new User({
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: hashedPassword,
    });
    
    const result = await collection.insertOne(user);
    
    // Create a completely plain object
    return {
      _id: result.insertedId.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString() // Convert Date to string
    };
  }

  static async authenticate(email, password) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    
    // Create a completely plain object
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString() // Convert Date to string
    };
  }

  static async findById(id) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    
    if (user) {
      // Create a completely plain object
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString() // Convert Date to string
      };
    }
    
    return null;
  }
}

export default User;