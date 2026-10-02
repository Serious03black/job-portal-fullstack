const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { getDb, saveDb } = require('../db');

// Candidate Login
router.post('/candidate/login', async (req, res) => {
  const { email, password } = req.body;
  const emailClean = (email || '').trim().toLowerCase();

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ role: 'candidate', email: emailClean });
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid candidate email or password.' });
      }
      const userObj = user.toObject();
      delete userObj.password;
      return res.json({
        success: true,
        message: 'Candidate login successful (MongoDB)',
        token: `cand_token_${Date.now()}`,
        user: userObj
      });
    }
  } catch (err) {
    console.error('Mongo candidate login error, using fallback:', err.message);
  }

  // Fallback to local DB
  const db = getDb();
  const user = db.users.find(u => u.role === 'candidate' && u.email.toLowerCase() === emailClean);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid candidate email or password.' });
  }

  const { password: _, ...safeUser } = user;
  return res.json({
    success: true,
    message: 'Candidate login successful',
    token: `cand_token_${Date.now()}`,
    user: safeUser
  });
});

// Candidate Register
router.post('/candidate/register', async (req, res) => {
  const { name, email, password, phone, experience, location } = req.body;
  const emailClean = (email || '').trim().toLowerCase();

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email: emailClean });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const newUser = await User.create({
        id: `usr_cand_${Date.now()}`,
        role: 'candidate',
        name,
        email: emailClean,
        password,
        phone: phone || '',
        location: location || '',
        experience: experience || '0 Years',
        currentCtc: 'Not specified',
        expectedCtc: 'Not specified',
        noticePeriod: 'Immediate',
        skills: []
      });

      const userObj = newUser.toObject();
      delete userObj.password;
      return res.status(201).json({
        success: true,
        message: 'Registration successful! (Saved to MongoDB Atlas)',
        token: `cand_token_${Date.now()}`,
        user: userObj
      });
    }
  } catch (err) {
    console.error('Mongo register error, using fallback:', err.message);
  }

  // Fallback to local DB
  const db = getDb();
  const existing = db.users.find(u => u.email.toLowerCase() === emailClean);
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `usr_cand_${Date.now()}`,
    role: 'candidate',
    name,
    email: emailClean,
    password,
    phone: phone || '',
    location: location || '',
    experience: experience || '0 Years',
    currentCtc: 'Not specified',
    expectedCtc: 'Not specified',
    noticePeriod: 'Immediate',
    skills: [],
    resumeName: null,
    registeredAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb();

  const { password: _, ...safeUser } = newUser;
  return res.status(201).json({
    success: true,
    message: 'Registration successful! Welcome to AXYTES Candidate Portal.',
    token: `cand_token_${Date.now()}`,
    user: safeUser
  });
});

// Employee Login
router.post('/employee/login', async (req, res) => {
  const { identifier, password } = req.body;
  const idClean = (identifier || '').trim().toLowerCase();

  try {
    if (mongoose.connection.readyState === 1) {
      const employee = await User.findOne({
        role: 'employee',
        $or: [{ code: idClean.toUpperCase() }, { email: idClean }]
      });

      if (!employee || employee.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid Employee Code / Email or password.' });
      }

      const empObj = employee.toObject();
      delete empObj.password;
      return res.json({
        success: true,
        message: 'Employee authenticated successfully (MongoDB)',
        token: `emp_token_${Date.now()}`,
        employee: empObj
      });
    }
  } catch (err) {
    console.error('Mongo employee login error, using fallback:', err.message);
  }

  const db = getDb();
  const employee = db.users.find(u =>
    u.role === 'employee' &&
    ((u.code && u.code.toLowerCase() === idClean) || (u.email && u.email.toLowerCase() === idClean))
  );

  if (!employee || employee.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid Employee Code / Email or password.' });
  }

  const { password: _, ...safeEmployee } = employee;
  return res.json({
    success: true,
    message: 'Employee authenticated successfully',
    token: `emp_token_${Date.now()}`,
    employee: safeEmployee
  });
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const emailClean = (email || '').trim().toLowerCase();

  try {
    if (mongoose.connection.readyState === 1) {
      const admin = await User.findOne({ role: 'admin', email: emailClean });
      if (!admin || admin.password !== password) {
        return res.status(401).json({ success: false, message: 'Access Denied: Invalid administrative credentials.' });
      }

      const adminObj = admin.toObject();
      delete adminObj.password;
      return res.json({
        success: true,
        message: 'Administrative session authorized (MongoDB)',
        token: `admin_token_${Date.now()}`,
        admin: adminObj
      });
    }
  } catch (err) {
    console.error('Mongo admin login error, using fallback:', err.message);
  }

  const db = getDb();
  const admin = db.users.find(u => u.role === 'admin' && u.email.toLowerCase() === emailClean);

  if (!admin || admin.password !== password) {
    return res.status(401).json({ success: false, message: 'Access Denied: Invalid administrative credentials.' });
  }

  const { password: _, ...safeAdmin } = admin;
  return res.json({
    success: true,
    message: 'Administrative session authorized',
    token: `admin_token_${Date.now()}`,
    admin: safeAdmin
  });
});

module.exports = router;
