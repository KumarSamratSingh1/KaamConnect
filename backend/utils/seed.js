const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');

const DEMO_USERS = [
  { name: 'Admin User', email: 'admin@kaamconnect.com', phone: '9000000001', password: 'Admin@123456', role: 'admin' },
  { name: 'Priya Sharma', email: 'customer@demo.com', phone: '9000000002', password: 'Demo@123456', role: 'customer', location: { city: 'Bhopal', state: 'Madhya Pradesh', address: 'Arera Colony' } },
  { name: 'Rajesh Kumar', email: 'customer2@demo.com', phone: '9000000003', password: 'Demo@123456', role: 'customer', location: { city: 'Indore', state: 'Madhya Pradesh' } },
];

const DEMO_WORKERS = [
  { name: 'Sunita Devi', email: 'worker@demo.com', phone: '9000000010', skills: ['cooking', 'cleaning'], experience: 5, city: 'Bhopal', salary: { min: 10000, max: 15000 }, rating: 4.8, workType: 'part-time' },
  { name: 'Kavita Patel', email: 'worker2@demo.com', phone: '9000000011', skills: ['babysitting', 'eldercare'], experience: 8, city: 'Bhopal', salary: { min: 15000, max: 22000 }, rating: 4.9, workType: 'full-time' },
  { name: 'Meena Verma', email: 'worker3@demo.com', phone: '9000000012', skills: ['cleaning', 'washing', 'ironing'], experience: 3, city: 'Indore', salary: { min: 7000, max: 12000 }, rating: 4.5, workType: 'part-time' },
  { name: 'Rekha Singh', email: 'worker4@demo.com', phone: '9000000013', skills: ['cooking', 'babysitting'], experience: 10, city: 'Bhopal', salary: { min: 18000, max: 25000 }, rating: 5.0, workType: 'full-time' },
  { name: 'Anita Yadav', email: 'worker5@demo.com', phone: '9000000014', skills: ['nursing', 'eldercare'], experience: 6, city: 'Nagpur', salary: { min: 20000, max: 30000 }, rating: 4.7, workType: 'live-in' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing demo data
    const emails = [...DEMO_USERS, ...DEMO_WORKERS].map(u => u.email);
    await User.deleteMany({ email: { $in: emails } });
    console.log('Cleared existing demo data');

    // Create users
    for (const userData of DEMO_USERS) {
      const user = await User.create(userData);
      console.log(`✅ Created ${userData.role}: ${userData.name}`);
    }

    // Create workers
    for (const w of DEMO_WORKERS) {
      const { skills, experience, city, salary, rating, workType, ...userData } = w;
      const user = await User.create({ ...userData, password: 'Demo@123456', role: 'worker', location: { city, state: 'MP' } });
      await WorkerProfile.create({
        user: user._id, skills, experience, workType,
        expectedSalary: { min: salary.min, max: salary.max, per: 'month' },
        languagesKnown: ['Hindi', 'English'],
        verificationStatus: 'verified', isVerified: true,
        profileCompletion: 90,
        'rating.average': rating, 'rating.count': Math.floor(Math.random() * 50) + 10,
        totalBookings: Math.floor(Math.random() * 80) + 5,
        completedBookings: Math.floor(Math.random() * 70) + 5,
        availabilityStatus: 'available',
        verificationBadges: [{ type: 'aadhaar', verified: true, verifiedAt: new Date() }],
        serviceRadius: 15,
        shifts: ['morning', 'evening'],
        workDays: ['monday','tuesday','wednesday','thursday','friday','saturday'],
        experienceDescription: `Experienced domestic worker with ${experience} years of professional service. Hardworking, trustworthy, and dedicated.`,
      });
      console.log(`✅ Created worker: ${userData.name}`);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nDemo Credentials:');
    console.log('Customer: customer@demo.com / Demo@123456');
    console.log('Worker:   worker@demo.com / Demo@123456');
    console.log('Admin:    admin@kaamconnect.com / Admin@123456');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
