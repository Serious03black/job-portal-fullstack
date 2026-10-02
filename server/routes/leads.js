const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// Handle Employer Talent Requisition submission
router.post('/employer-request', (req, res) => {
  const { companyName, contactPerson, email, phone, serviceRequired, positionsCount, roleDescription } = req.body;
  const db = getDb();

  if (!companyName || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Company name, email, and phone are mandatory.' });
  }

  const lead = {
    id: `LEAD-${Date.now()}`,
    companyName,
    contactPerson: contactPerson || '',
    email,
    phone,
    serviceRequired: serviceRequired || 'Staffing',
    positionsCount: positionsCount || '1-5',
    roleDescription: roleDescription || '',
    status: 'New',
    createdAt: new Date().toISOString()
  };

  db.employerLeads = db.employerLeads || [];
  db.employerLeads.unshift(lead);
  saveDb();

  return res.status(201).json({
    success: true,
    message: 'Staffing requisition logged successfully! An AXYTES account lead will connect within 2 business hours.',
    leadId: lead.id
  });
});

// Handle General Contact Form Inquiry
router.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const db = getDb();

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  const inquiry = {
    id: `INQ-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    status: 'Unread',
    receivedAt: new Date().toISOString()
  };

  db.contactInquiries = db.contactInquiries || [];
  db.contactInquiries.unshift(inquiry);
  saveDb();

  return res.status(201).json({
    success: true,
    message: 'Your message has been received! Our client relations desk will respond shortly.',
    inquiryId: inquiry.id
  });
});

// Admin list of leads & inquiries
router.get('/employer-requests', (req, res) => {
  const db = getDb();
  return res.json({ success: true, total: (db.employerLeads || []).length, leads: db.employerLeads || [] });
});

router.get('/contact-inquiries', (req, res) => {
  const db = getDb();
  return res.json({ success: true, total: (db.contactInquiries || []).length, inquiries: db.contactInquiries || [] });
});

module.exports = router;
