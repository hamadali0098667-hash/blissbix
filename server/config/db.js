const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    // If the URI is a local one and we don't have a local mongo, use memory server
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
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
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
