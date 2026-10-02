const mongoose = require('mongoose');

const EmployerLeadSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceRequired: { type: String, default: 'Staffing' },
  positionsCount: { type: String, default: '1-5' },
  roleDescription: { type: String, default: '' },
  status: { type: String, default: 'New' }
}, {
  timestamps: true
});

const ContactInquirySchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  status: { type: String, default: 'Unread' }
}, {
  timestamps: true
});

module.exports = {
  EmployerLead: mongoose.model('EmployerLead', EmployerLeadSchema),
  ContactInquiry: mongoose.model('ContactInquiry', ContactInquirySchema)
};
