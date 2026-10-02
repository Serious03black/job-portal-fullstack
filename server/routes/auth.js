const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// Candidate Login
router.post('/candidate/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.role === 'candidate' && u.email.toLowerCase() === (email || '').toLowerCase());

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
router.post('/candidate/register', (req, res) => {
  const { name, email, password, phone, experience, location } = req.body;
  const db = getDb();

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `usr_cand_${Date.now()}`,
    role: 'candidate',
    name,
    email,
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
router.post('/employee/login', (req, res) => {
  const { identifier, password } = req.body; // Can be email or employee code
  const db = getDb();
  const idLower = (identifier || '').trim().toLowerCase();

  const employee = db.users.find(u =>
    u.role === 'employee' &&
    ((u.code && u.code.toLowerCase() === idLower) || (u.email && u.email.toLowerCase() === idLower))
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
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const admin = db.users.find(u => u.role === 'admin' && u.email.toLowerCase() === (email || '').toLowerCase());

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
