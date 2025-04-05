const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create and save new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Error in /register:", err);
    // Handle validation errors or duplicate key errors
    if (err.code === 11000) {  // duplicate key (email uniqueness)
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Delay response to mitigate user enumeration attacks (optional)
      await new Promise(r => setTimeout(r, 500));
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Compare password with stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Create JWT payload and token
    const payload = { userId: user._id, name: user.name };
    const secret = process.env.JWT_SECRET || 'development_jwt_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    // Respond with token and user info
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
