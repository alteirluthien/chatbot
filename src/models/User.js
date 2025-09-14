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
    return await collection.findOne({ email: email.toLowerCase() });
  }

  static async create(userData) {
    const collection = await this.getCollection();
    
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = new User({
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: hashedPassword,
    });
    
    const result = await collection.insertOne(user);
    
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: result.insertedId };
  }

  static async authenticate(email, password) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async findById(id) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }
}

// Fixed export statement
export default User;
