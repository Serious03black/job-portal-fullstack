const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  company: { type: String, default: 'Client Mandate' },
  location: { type: String, required: true },
  type: { type: String, default: 'Full-time' },
  category: { type: String, default: 'General' },
  salary: { type: String, default: 'Negotiable' },
  experience: { type: String, default: '1 – 3 Years' },
  openings: { type: Number, default: 1 },
  status: { type: String, default: 'Active', enum: ['Active', 'Closed'] },
  description: { type: String, default: '' },
  skills: [{ type: String }],
  postedDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);
