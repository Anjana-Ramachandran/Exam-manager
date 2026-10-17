const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, trim: true },
  userName: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, enum: ['Admin', 'Student', 'Faculty'], required: true, trim: true },
  phoneNumber: { type: String, default: '', trim: true },
  emailId: { type: String,default: '', required: true, trim: true },
  otp: { type: String },
  department: { type: String, required: true, trim: true },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
}, {
  timestamps: true
});
const User = mongoose.model('User', userSchema);

// Add the getAllUsers() method to the User model
User.getAllUsers = async function () {
  return await this.find({}); // Fetch all users from the database
};

module.exports = mongoose.model('User', userSchema);