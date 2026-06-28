const mongoose = require('mongoose');

function dotenvConfig() {
  // Lazy-load dotenv to ensure env is read when this module is required.
  try {
    require('dotenv').config();
  } catch (_) {
    // ignore
  }
}

dotenvConfig();



const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables');
}

mongoose.set('strictQuery', true);

async function connectDB() {
  // Connection pooling is handled by Mongoose/MongoDB driver.
  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
    serverSelectionTimeoutMS: 15000
  });
}

connectDB().then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

