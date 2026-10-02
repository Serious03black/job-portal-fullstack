const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// Get employee profile
router.get('/profile/:code', (req, res) => {
  const db = getDb();
  const emp = db.users.find(u => u.role === 'employee' && (u.code === req.params.code || u.id === req.params.code));
  if (!emp) {
    return res.status(404).json({ success: false, message: 'Employee record not found.' });
  }

  const { password: _, ...profile } = emp;
  return res.json({ success: true, profile });
});

// Check-in attendance
router.post('/attendance/check-in', (req, res) => {
  const { employeeCode } = req.body;
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let record = db.attendance.find(a => a.employeeCode === employeeCode && a.date === today);
  if (record && record.checkIn) {
    return res.status(400).json({ success: false, message: `Already checked in today at ${record.checkIn}.`, record });
  }

  if (!record) {
    record = {
      id: `ATT-${Date.now()}`,
      employeeCode,
      date: today,
      checkIn: timeNow,
      checkOut: null,
      status: 'Present'
    };
    db.attendance.push(record);
  } else {
    record.checkIn = timeNow;
  }

  saveDb();
  return res.json({ success: true, message: `Checked in successfully at ${timeNow}!`, record });
});

// Check-out attendance
router.post('/attendance/check-out', (req, res) => {
  const { employeeCode } = req.body;
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let record = db.attendance.find(a => a.employeeCode === employeeCode && a.date === today);
  if (!record || !record.checkIn) {
    return res.status(400).json({ success: false, message: 'You must check in before checking out.' });
  }

  record.checkOut = timeNow;
  saveDb();
  return res.json({ success: true, message: `Checked out successfully at ${timeNow}! Have a great evening.`, record });
});

// Get attendance history
router.get('/attendance/:code', (req, res) => {
  const db = getDb();
  const list = db.attendance.filter(a => a.employeeCode === req.params.code);
  return res.json({ success: true, totalDays: list.length, attendance: list });
});

// Get employee leaves
router.get('/leaves/:code', (req, res) => {
  const db = getDb();
  const list = db.leaves.filter(l => l.employeeCode === req.params.code);
  const balance = {
    casualLeave: 8,
    sickLeave: 5,
    earnedLeave: 12,
    totalRemaining: 25
  };
  return res.json({ success: true, balance, leaves: list });
});

// Apply for leave
router.post('/leaves', (req, res) => {
  const { employeeCode, leaveType, fromDate, toDate, days, reason } = req.body;
  const db = getDb();

  const emp = db.users.find(u => u.role === 'employee' && u.code === employeeCode);
  if (!emp) {
    return res.status(404).json({ success: false, message: 'Invalid employee code.' });
  }

  const newLeave = {
    id: `LEV-${Date.now()}`,
    employeeCode,
    employeeName: emp.name,
    clientSite: emp.clientSite || 'Client Site',
    leaveType: leaveType || 'Casual Leave',
    fromDate,
    toDate,
    days: Number(days) || 1,
    reason: reason || 'Personal emergency',
    status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0]
  };

  db.leaves.unshift(newLeave);
  saveDb();
  return res.status(201).json({ success: true, message: 'Leave request submitted for HR approval.', leave: newLeave });
});

// Get payslips breakdown
router.get('/payslips/:code', (req, res) => {
  const db = getDb();
  const emp = db.users.find(u => u.role === 'employee' && u.code === req.params.code);
  if (!emp) {
    return res.status(404).json({ success: false, message: 'Employee not found.' });
  }

  const basic = emp.basicSalary || 18000;
  const hra = emp.hra || 9000;
  const conv = emp.conveyance || 3000;
  const spec = emp.specialAllowance || 5000;
  const gross = basic + hra + conv + spec;

  const pfDeduction = Math.round(basic * 0.12);
  const esicDeduction = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
  const profTax = 200;
  const totalDeductions = pfDeduction + esicDeduction + profTax;
  const netPay = gross - totalDeductions;

  const payslips = [
    {
      month: "September 2024",
      period: "01-Sep-2024 to 30-Sep-2024",
      paidDays: 30,
      grossEarnings: gross,
      totalDeductions,
      netSalary: netPay,
      status: "Disbursed",
      disbursedDate: "2024-10-01",
      earningsBreakdown: { basic, hra, conveyance: conv, specialAllowance: spec },
      deductionsBreakdown: { providentFund: pfDeduction, esic: esicDeduction, professionalTax: profTax }
    },
    {
      month: "August 2024",
      period: "01-Aug-2024 to 31-Aug-2024",
      paidDays: 31,
      grossEarnings: gross,
      totalDeductions,
      netSalary: netPay,
      status: "Disbursed",
      disbursedDate: "2024-09-01",
      earningsBreakdown: { basic, hra, conveyance: conv, specialAllowance: spec },
      deductionsBreakdown: { providentFund: pfDeduction, esic: esicDeduction, professionalTax: profTax }
    }
  ];

  return res.json({ success: true, payslips });
});

module.exports = router;
