import express from 'express';
import { createUser, findUserByPhone, findUserById } from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { username, phoneNumber } = req.body;
    
    // Validation
    if (!username || !phoneNumber) {
      return res.status(400).json({ error: 'Username and phone number are required' });
    }
    
    if (username.trim().length < 2) {
      return res.status(400).json({ error: 'Username must be at least 2 characters' });
    }
    
    // Phone number validation (international format with country code)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      return res.status(400).json({ error: 'Invalid phone number format. Must include country code (e.g., +212)' });
    }
    
    // Check if user already exists
    const existingUser = await findUserByPhone(phoneNumber.trim());
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }
    
    // Create user
    const user = await createUser(username.trim(), phoneNumber.trim());
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // Validation
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // Find user
    const user = await findUserByPhone(phoneNumber.trim());
    if (!user) {
      return res.status(401).json({ error: 'Phone number not registered' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user (protected)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

