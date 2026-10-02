const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const { getDb, saveDb } = require('../db');

// List jobs with multi-facet filtering and search
router.get('/', async (req, res) => {
  const { kw, loc, cat, type, status } = req.query;

  try {
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (status) {
        query.status = new RegExp(`^${status}$`, 'i');
      }
      if (loc) {
        query.location = new RegExp(loc, 'i');
      }
      if (cat) {
        query.category = new RegExp(cat, 'i');
      }
      if (type) {
        query.type = new RegExp(type, 'i');
      }
      if (kw) {
        query.$or = [
          { title: new RegExp(kw, 'i') },
          { description: new RegExp(kw, 'i') },
          { company: new RegExp(kw, 'i') },
          { skills: new RegExp(kw, 'i') }
        ];
      }

      const jobs = await Job.find(query).sort({ createdAt: -1 });
      return res.json({
        success: true,
        source: 'MongoDB Atlas',
        total: jobs.length,
        jobs
      });
    }
  } catch (err) {
    console.error('Mongo list jobs error, using fallback:', err.message);
  }

  // Fallback to local DB
  const db = getDb();
  let results = [...db.jobs];

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
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const job = await Job.findOne({ id: req.params.id });
      if (job) {
        return res.json({ success: true, job });
      }
    }
  } catch (err) {
    console.error('Mongo single job error:', err.message);
  }

  const db = getDb();
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job posting not found.' });
  }
  return res.json({ success: true, job });
});

// Create new job posting (Admin)
router.post('/', async (req, res) => {
  const { title, company, location, type, category, salary, experience, openings, description, skills } = req.body;

  if (!title || !location) {
    return res.status(400).json({ success: false, message: 'Title and location are mandatory.' });
  }

  const skillsArr = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);
  const jobId = `JOB-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

  try {
    if (mongoose.connection.readyState === 1) {
      const newJob = await Job.create({
        id: jobId,
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
        skills: skillsArr,
        postedDate: new Date().toISOString().split('T')[0]
      });

      return res.status(201).json({
        success: true,
        message: 'Job posting published to MongoDB Atlas.',
        job: newJob
      });
    }
  } catch (err) {
    console.error('Mongo create job error, using fallback:', err.message);
  }

  const db = getDb();
  const newJob = {
    id: jobId,
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
    skills: skillsArr,
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
router.put('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const job = await Job.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
      if (job) {
        return res.json({ success: true, message: 'Job updated successfully (MongoDB).', job });
      }
    }
  } catch (err) {
    console.error('Mongo update job error:', err.message);
  }

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
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deleted = await Job.findOneAndDelete({ id: req.params.id });
      if (deleted) {
        return res.json({ success: true, message: 'Job removed from MongoDB Atlas.', job: deleted });
      }
    }
  } catch (err) {
    console.error('Mongo delete job error:', err.message);
  }

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
