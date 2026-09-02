const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    let uri = process.env.MONGO_URI;
    
    // If the URI is a local one and we don't have a local mongo, use memory server
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        throw new Error('MONGO_URI is missing or pointing to localhost. In production/Vercel, please set MONGO_URI to your MongoDB Atlas connection string.');
      }
      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '4.4.16' // Older version is more stable on Windows without VC++ redist
        }
      });
      uri = mongoServer.getUri();
      console.log('Using In-Memory MongoDB for development');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
