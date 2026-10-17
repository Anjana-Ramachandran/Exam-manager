const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const User = require('../models/user.model');

router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/create-password', authController.createPassword);
router.post('/create-account', authController.createAccount);
router.post('/forgot-password', authController.retrievePassword);
// New route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.getAllUsers(); // Fetch all users from the database
    res.status(200).json(users); // Return the users
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
});

module.exports = router;