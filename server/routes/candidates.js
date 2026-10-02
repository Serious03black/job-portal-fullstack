const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// Get candidate profile
router.get('/profile/:id', (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.role === 'candidate' && u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
  }

  const { password: _, ...profile } = user;
  return res.json({ success: true, profile });
});

// Update candidate profile
router.put('/profile/:id', (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.role === 'candidate' && u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
  }

  const allowedFields = ['name', 'phone', 'location', 'experience', 'currentCtc', 'expectedCtc', 'noticePeriod', 'skills', 'resumeName'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  saveDb();
  const { password: _, ...profile } = user;
  return res.json({ success: true, message: 'Profile updated successfully.', profile });
});

// Apply to a job
router.post('/apply', (req, res) => {
  const { candidateId, jobId } = req.body;
  const db = getDb();

  const user = db.users.find(u => u.role === 'candidate' && u.id === candidateId);
  const job = db.jobs.find(j => j.id === jobId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Candidate not registered.' });
  }
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job posting not found.' });
  }

  // Check if already applied
  const existingApp = db.applications.find(a => a.candidateId === candidateId && a.jobId === jobId);
  if (existingApp) {
    return res.status(400).json({
      success: false,
      message: 'You have already applied for this opening.',
      application: existingApp
    });
  }

  const newApp = {
    id: `APP-${1000 + db.applications.length + 1}`,
    candidateId,
    candidateName: user.name,
    candidateEmail: user.email,
    candidatePhone: user.phone || '',
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied', // Pipeline: Applied -> Shortlisted -> Interview Scheduled -> Offer Extended / Rejected
    interviewDate: null,
    interviewMode: null
  };

  db.applications.unshift(newApp);
  saveDb();

  return res.status(201).json({
    success: true,
    message: `Application submitted successfully for ${job.title}!`,
    application: newApp
  });
});

// List applied jobs for a candidate
router.get('/applications/:candidateId', (req, res) => {
  const db = getDb();
  const apps = db.applications.filter(a => a.candidateId === req.params.candidateId);
  return res.json({
    success: true,
    total: apps.length,
    applications: apps
  });
});

module.exports = router;
