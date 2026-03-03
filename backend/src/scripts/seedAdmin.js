require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const exists = await User.findOne({ role: 'admin' });
  if (exists) {
    console.log('Admin user already exists:', exists.email);
    process.exit(0);
    return;
  }
  await User.create({
    name: 'Admin',
    email: 'admin@carrental.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('Admin created: admin@carrental.com / admin123');
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
