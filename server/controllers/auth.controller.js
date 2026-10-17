const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'smtp.mailtrap.io', 'sendgrid', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password (or app password if using Gmail)
  },
});

exports.login = async (req, res) => {
    const { userId, password } = req.body;
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found. Please check your User ID and Password' 
        });
      }
  
      
        const isPasswordValid =await bcrypt.compare(password,user.password);
        if(!isPasswordValid)
        {
          return res.status(401).json({ error: 'Invalid password.' });
        }
       
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password.' });
      }
  
      const token = jwt.sign(
        { userId: user.userId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Remove sensitive data before sending response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.otp;
  
      res.status(200).json({
        message: 'Login successful',
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Error logging in.' });
    }
  };
exports.retrievePassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Validate input
        if (!email) {
            return res.status(400).json({
                error: 'Email is required.'
            });
        }

        // Find user by email
        const user = await User.findOne({ emailId: email });
        if (!user) {
            return res.status(404).json({
                error: 'User not found with the provided email.'
            });
        }

        // Generate a temporary password
        const tempPassword = crypto.randomBytes(6).toString('hex'); // 12-character temp password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Update user's password in the database
        user.password = hashedPassword;
        console.log(user.password)
        console.log(tempPassword)
        await user.save();

        // Send email with the new temporary password
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Temporary Password',
            text: `Your new temporary password is: ${tempPassword}\nPlease log in and change your password immediately.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'A temporary password has been sent to your registered email.'
        });

    } catch (error) {
        console.error('Retrieve Password error:', error);
        res.status(500).json({
            error: 'An error occurred while retrieving the password.'
        });
    }
};

  
  // Send OTP implementation
  exports.sendOtp = async (req, res) => {
    const { userId, email } = req.body;
  
    try {
      // Validate input
      if (!userId || !email) {
        return res.status(400).json({ 
          error: 'Both User ID and Email are required.' 
        });
      }
  
      // Find user
      const user = await User.findOne({ userId, emailId: email });
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found with the provided User ID and Email.' 
        });
      }
  
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      
      // Save OTP to user document
      user.otp = otp;
      await user.save();
  
      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Password Creation',
        text: `Your OTP code is: ${otp}\nThis code will expire in 10 minutes.`
      };
  
      await transporter.sendMail(mailOptions);
  
      // Set OTP expiration (10 minutes)
      setTimeout(async () => {
        if (user.otp === otp) {
          user.otp = null;
          await user.save();
        }
      }, 10 * 60 * 1000);
  
      res.status(200).json({ 
        message: 'OTP sent successfully to your email.' 
      });
  
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({ 
        error: 'An error occurred while sending OTP.' 
      });
    }
  };
  
  // Verify OTP implementation
  exports.verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;
  
    try {
      // Validate input
      if (!userId || !otp) {
        return res.status(400).json({ 
          error: 'Both User ID and OTP are required.' 
        });
      }
  
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check if OTP exists and matches
      if (!user.otp) {
        return res.status(400).json({ 
          error: 'OTP has expired. Please request a new one.' 
        });
      }
  
      if (user.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP.' });
      }
  
      // Clear OTP after successful verification
      user.otp = null;
      await user.save();
  
      res.status(200).json({ 
        message: 'OTP verified successfully.',
        valid: true 
      });
  
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ 
        error: 'An error occurred during OTP verification.' 
      });
    }
  };
  
  // Create Password implementation
  exports.createPassword = async (req, res) => {
    const { userId, password, retypePassword } = req.body;
    console.log(req.body)
  
    try {
      // Validate input
      if (!userId || !password || !retypePassword) {
        return res.status(400).json({ 
          error: 'All fields are required.' 
        });
      }
  
      // Check password match
      if (password !== retypePassword) {
        return res.status(400).json({ 
          error: 'Passwords do not match.' 
        });
      }
  
      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        });
      }
  
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Hash and save new password
      user.password = await bcrypt.hash(password, 10);
      await user.save();

      console.log('Saved hashed password:', user.password);
  
      // Generate JWT token for automatic login
      const token = jwt.sign(
        { userId: user.userId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Remove sensitive data before sending response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.otp;
  
      res.status(200).json({
        message: 'Password created successfully.',
        user: userResponse,
        token
      });
  
    } catch (error) {
      console.error('Create password error:', error);
      res.status(500).json({ 
        error: 'An error occurred while creating the password.' 
      });
    }
  };


const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/;  // Assumes 10-digit phone number
    return re.test(phone);
  };
  
  exports.createAccount = async (req, res) => {
    try {
      const users = req.body;
      if (!Array.isArray(users)) {
        return res.status(400).json({ error: 'Input should be an array of users' });
      }
  
      const results = {
        successful: [],
        failed: []
      };
  
      for (const userData of users) {
        try {
          // Skip empty entries
          if (!userData || !userData.userId) {
            continue;
          }
  
          const { userId, userName, password, role, phoneNumber, emailId,department } = userData;
     console.log("userdata",userData);
          // Enhanced validation logging
          const missingFields = [];
          if (!userId) missingFields.push('userId');
          if (!userName) missingFields.push('userName');
          if (!password) missingFields.push('password');
          if (!role) missingFields.push('role');
  
          if (missingFields.length > 0) {
            results.failed.push({ 
              userId: userId || 'unknown', 
              error: `Required fields missing: ${missingFields.join(', ')}` 
            });
            continue;
          }
  
          // Role validation
          if (!['Admin', 'Student', 'Faculty'].includes(role)) {
            results.failed.push({ 
              userId, 
              error: `Invalid role: ${role}. Must be Admin, Student, or Faculty` 
            });
            continue;
          }
  
          // Check if user already exists with detailed error
          const existingUser = await User.findOne({ 
            $or: [
              { userId }, 
              { emailId: emailId || '' }
            ] 
          });
          
          if (existingUser) {
            const duplicateField = existingUser.userId === userId ? 'userId' : 'emailId';
            results.failed.push({ 
              userId, 
              error: `User with this ${duplicateField} already exists` 
            });
            continue;
          }
  
          // Create new user with explicit schema matching
          const user = new User({
            userId: userId.trim(),
            userName: userName.trim(),
            password: await bcrypt.hash(password.trim(), 10),
            role: role.trim(),
            phoneNumber: (phoneNumber || '').trim(),
            emailId: (emailId || '').trim(),
            department:department.trim()
          });
  
          // Add validation logging
          const validationError = user.validateSync();
          if (validationError) {
            results.failed.push({ 
              userId, 
              error: `Validation error: ${Object.values(validationError.errors).map(err => err.message).join(', ')}` 
            });
            continue;
          }
  
          // Save with detailed error catching
          await user.save();
  
          // Remove password from response
          const userResponse = user.toObject();
          delete userResponse.password;
          
          results.successful.push(userResponse);
  
        } catch (error) {
          console.error('Error creating user:', {
            userId: userData.userId,
            error: error.message,
            stack: error.stack
          });
  
          results.failed.push({ 
            userId: userData.userId, 
            error: `Failed to create user: ${error.message}` 
          });
        }
      }
  
      // Log final results
      console.log('Bulk creation results:', {
        totalProcessed: users.length,
        successful: results.successful.length,
        failed: results.failed.length
      });
  
      res.status(201).json({
        message: 'Bulk creation completed',
        results,
        summary: {
          totalProcessed: users.length,
          successful: results.successful.length,
          failed: results.failed.length
        }
      });
  
    } catch (error) {
      console.error('Bulk create accounts error:', error);
      res.status(500).json({ 
        error: 'An error occurred while creating accounts',
        details: error.message
      });
    }
  };

  