const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Register - works for patient, doctor, or admin (role passed in body)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization, fee, address, location } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      phone,
      specialization,
      fee,
      address,
      location,
    });

    const token = generateToken(user);
    const { password: _pw, ...userSafe } = user.toObject();
    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    const { password: _pw, ...userSafe } = user.toObject();
    res.json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
