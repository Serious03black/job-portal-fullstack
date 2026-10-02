const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// Executive dashboard overview KPIs
router.get('/dashboard', (req, res) => {
  const db = getDb();
  const activeJobs = db.jobs.filter(j => j.status.toLowerCase() === 'active').length;
  const totalCandidates = db.users.filter(u => u.role === 'candidate').length;
  const totalEmployees = db.users.filter(u => u.role === 'employee').length;
  const pendingLeaves = db.leaves.filter(l => l.status === 'Pending').length;

  return res.json({
    success: true,
    kpis: {
      activeJobs,
      totalCandidates,
      deputedEmployees: totalEmployees + 127, // Including simulated field roster
      pendingLeaves,
      totalApplications: db.applications.length,
      monthlyPlacements: 118,
      turnaroundAvgDays: 14.2
    },
    recentApplications: db.applications.slice(0, 5),
    pendingLeavesList: db.leaves.filter(l => l.status === 'Pending')
  });
});

// Candidate pool management
router.get('/candidates', (req, res) => {
  const { q, exp, loc, skill } = req.query;
  const db = getDb();
  let list = db.users.filter(u => u.role === 'candidate').map(({ password, ...c }) => c);

  if (q) {
    const query = q.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query));
  }
  if (loc) {
    list = list.filter(c => c.location && c.location.toLowerCase().includes(loc.toLowerCase()));
  }
  if (skill) {
    list = list.filter(c => c.skills && c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
  }

  return res.json({ success: true, total: list.length, candidates: list });
});

// Update application pipeline stage
router.put('/applications/:id/status', (req, res) => {
  const { status, interviewDate, interviewMode } = req.body;
  const db = getDb();
  const app = db.applications.find(a => a.id === req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  app.status = status || app.status;
  if (interviewDate !== undefined) app.interviewDate = interviewDate;
  if (interviewMode !== undefined) app.interviewMode = interviewMode;

  saveDb();
  return res.json({ success: true, message: `Application stage changed to "${app.status}".`, application: app });
});

// Leave approval / rejection
router.put('/leaves/:id', (req, res) => {
  const { status } = req.body; // 'Approved' or 'Rejected'
  const db = getDb();
  const leave = db.leaves.find(l => l.id === req.params.id);

  if (!leave) {
    return res.status(404).json({ success: false, message: 'Leave record not found.' });
  }

  leave.status = status;
  leave.processedAt = new Date().toISOString();
  saveDb();

  return res.json({ success: true, message: `Leave application marked as ${status}.`, leave });
});

// Operational & recruitment reports
router.get('/reports', (req, res) => {
  return res.json({
    success: true,
    placementsYtd: 968,
    monthlyTrend: [
      { month: 'May', count: 45 },
      { month: 'Jun', count: 62 },
      { month: 'Jul', count: 78 },
      { month: 'Aug', count: 92 },
      { month: 'Sep', count: 118 },
      { month: 'Oct (Est.)', count: 95 }
    ],
    sectorBreakdown: [
      { sector: 'Manufacturing & Engineering', percentage: 38, count: 368 },
      { sector: 'Logistics & 3PL Warehousing', percentage: 27, count: 261 },
      { sector: 'IT & Software Engineering', percentage: 19, count: 184 },
      { sector: 'BFSI & Retail FMCG', percentage: 16, count: 155 }
    ]
  });
});

module.exports = router;
