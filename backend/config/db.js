const mongoose = require('mongoose');
const dns = require('dns');

// Set reliable DNS servers for resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where custom DNS servers cannot be set
}

const ensureDefaultAdmin = async () => {
  try {
    const User = require('../models/User');
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kaamconnect.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log(`Bootstrapping default admin (${adminEmail})...`);
      admin = new User({
        name: 'Admin User',
        email: adminEmail,
        phone: '9000000001',
        password: adminPassword,
        role: 'admin',
        isActive: true,
        isBlocked: false,
        isEmailVerified: true,
        isPhoneVerified: true
      });
      await admin.save();
      console.log(`✅ Default admin account initialized: ${adminEmail}`);
    }
  } catch (err) {
    // If phone uniqueness or anything, don't crash the server
    console.warn('Admin check note:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Ensure default admin exists
    ensureDefaultAdmin();

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
