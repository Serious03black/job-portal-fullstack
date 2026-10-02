const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  candidateId: { type: String, required: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  candidatePhone: { type: String, default: '' },
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, default: '' },
  appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: {
    type: String,
    default: 'Applied',
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Rejected']
  },
  interviewDate: { type: String, default: null },
  interviewMode: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', ApplicationSchema);
