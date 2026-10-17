const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing
const User = require('../models/user.model'); // Your User model

async function createAccountsMigration() {
  // Define accounts
  const accounts = [
    { userId: 'admin1', userName: 'John', password: 'admin123', role: 'Admin', phoneNumber: '1234567890', emailId: 'admin@example.com' },
    { userId: 'faculty1', userName: 'Sarah Tr', password: 'faculty123', role: 'Faculty', phoneNumber: '1234567891', emailId: 'faculty1@example.com' },
    { userId: 'faculty2', userName: 'Clara Tr', password: 'faculty123', role: 'Faculty', phoneNumber: '1234567892', emailId: 'faculty2@example.com' },
    ...Array.from({ length: 12 }).map((_, i) => ({
      userId: `student${i + 1}`,
      userName: `Student ${i + 1}`,
      password: `student123`,
      role: 'Student',
      phoneNumber: `12345678${i + 10}`,
      emailId: `student${i + 1}@example.com`,
    })),
  ];

  try {
    // Hash passwords for all accounts
    for (const account of accounts) {
      account.password = await bcrypt.hash(account.password, 10); // Hash password with salt rounds = 10
    }

    // Insert accounts into the database
    await User.insertMany(accounts);
    console.log('Accounts migration completed!');
  } catch (err) {
    console.error('Error in createAccountsMigration:', err.message);
  }
}

module.exports = createAccountsMigration;
