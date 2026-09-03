const mongoose = require('mongoose');
const uri = "mongodb+srv://hamadali0098667_db_user:yzllEXgAPfS36aww@cluster0.gk8wkmm.mongodb.net/blissbix?appName=Cluster0";

async function testConnection() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to connect:', err.message);
    process.exit(1);
  }
}

testConnection();
