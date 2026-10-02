const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// List jobs with multi-facet filtering and search
router.get('/', (req, res) => {
  const { kw, loc, cat, type, status } = req.query;
  const db = getDb();
  let results = [...db.jobs];

  // Filter by active status by default unless specified
  if (status) {
    results = results.filter(j => j.status.toLowerCase() === status.toLowerCase());
  }

  if (kw) {
    const q = kw.toLowerCase().trim();
    results = results.filter(j =>
      j.title.toLowerCase().includes(q) ||
      (j.description && j.description.toLowerCase().includes(q)) ||
      (j.skills && j.skills.some(s => s.toLowerCase().includes(q))) ||
      (j.company && j.company.toLowerCase().includes(q))
    );
  }

  if (loc) {
    const l = loc.toLowerCase().trim();
    results = results.filter(j => j.location.toLowerCase().includes(l));
  }

  if (cat) {
    const c = cat.toLowerCase().trim();
    results = results.filter(j => j.category.toLowerCase().includes(c));
  }

  if (type) {
    const t = type.toLowerCase().trim();
    results = results.filter(j => j.type.toLowerCase().includes(t));
  }

  return res.json({
    success: true,
    total: results.length,
    jobs: results
  });
});

// Single job details
router.get('/:id', (req, res) => {
  const db = getDb();
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job posting not found.' });
  }
  return res.json({ success: true, job });
});

// Create new job posting (Admin)
router.post('/', (req, res) => {
  const { title, company, location, type, category, salary, experience, openings, description, skills } = req.body;
  const db = getDb();

  if (!title || !location) {
    return res.status(400).json({ success: false, message: 'Title and location are mandatory.' });
  }

  const newJob = {
    id: `JOB-${new Date().getFullYear()}-${String(db.jobs.length + 1).padStart(3, '0')}`,
    title,
    company: company || 'Client Mandate',
    location,
    type: type || 'Full-time',
    category: category || 'General',
    salary: salary || 'Negotiable',
    experience: experience || '1 – 3 Years',
    openings: Number(openings) || 1,
    status: 'Active',
    description: description || '',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
    postedDate: new Date().toISOString().split('T')[0]
  };

  db.jobs.unshift(newJob);
  saveDb();

  return res.status(201).json({
    success: true,
    message: 'Job posting published successfully.',
    job: newJob
  });
});

// Update or toggle job status
router.put('/:id', (req, res) => {
  const db = getDb();
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  const fields = ['title', 'company', 'location', 'type', 'category', 'salary', 'experience', 'openings', 'status', 'description', 'skills'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      job[f] = req.body[f];
    }
  });

  saveDb();
  return res.json({ success: true, message: 'Job updated successfully.', job });
});

// Delete job
router.delete('/:id', (req, res) => {
  const db = getDb();
  const index = db.jobs.findIndex(j => j.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  const deleted = db.jobs.splice(index, 1);
  saveDb();
  return res.json({ success: true, message: 'Job mandate removed.', job: deleted[0] });
});

module.exports = router;
