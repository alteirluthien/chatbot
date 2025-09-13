// src/app/api/test-user/route.js
import User from '@/models/User';

export async function GET() {
  try {
    console.log('User class:', User);
    console.log('User.authenticate type:', typeof User.authenticate);
    console.log('User.authenticate exists:', typeof User.authenticate === 'function');
    
    // Test if the authenticate method exists
    if (typeof User.authenticate === 'function') {
      return Response.json({ 
        message: 'User.authenticate method exists',
        staticMethods: Object.getOwnPropertyNames(User).filter(prop => typeof User[prop] === 'function')
      });
    } else {
      return Response.json({ 
        error: 'User.authenticate method not found',
        staticMethods: Object.getOwnPropertyNames(User).filter(prop => typeof User[prop] === 'function'),
        classType: typeof User,
        classMethods: Object.getOwnPropertyNames(User.__proto__).filter(prop => typeof User.__proto__[prop] === 'function')
      }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}