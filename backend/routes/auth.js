const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
 
  try {
    const { username, password, role } = req.body;


    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '❌ Username already exists!'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'user'
    });

    await newUser.save();

    console.log('✅ User registered:', username);

    res.json({
      success: true,
      message: '✅ Registration successful!',
      user: {
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.log('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed!'
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {


  try {
    const { username, password } = req.body;

    console.log('🔍 Login attempt:', username);

    
    const user = await User.findOne({ username });

    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({
        success: false,
        message: '❌ Invalid username or password!'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('❌ Wrong password for:', username);
      return res.status(401).json({
        success: false,
        message: '❌ Invalid username or password!'
      });
    }

    
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', username);
    console.log('🎫 Token created');

    res.json({
      success: true,
      message: '✅ Login successful!',
      token: token,
      user: {
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.log('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed!'
    });
  }
});

// ═══════ MIDDLEWARE: Verify JWT Token ═══════
function verifyToken(req, res, next) {


  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: '❌ No token provided!'
    });
  }

  try {
  
    const actualToken = token.replace('Bearer ', '');

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded; 
    next();  

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '❌ Invalid token!'
    });
  }
}

// Protected Route (Needs Token!)
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: '🎉 Welcome to dashboard!',
    user: req.user  
  });
});

// Get user profile (Protected)
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: {
      username: req.user.username,
      role: req.user.role,
      userId: req.user.userId
    }
  });
});

module.exports = router;
