const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  role: { type: String, required: true, enum: ['candidate', 'employee', 'admin'] },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  
  // Specific to Candidate
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  experience: { type: String, default: '0 Years' },
  currentCtc: { type: String, default: '' },
  expectedCtc: { type: String, default: '' },
  noticePeriod: { type: String, default: 'Immediate' },
  skills: [{ type: String }],
  resumeName: { type: String, default: null },

  // Specific to Employee
  code: { type: String, sparse: true, uppercase: true, trim: true },
  designation: { type: String, default: '' },
  clientSite: { type: String, default: '' },
  joiningDate: { type: String, default: '' },
  grossSalary: { type: Number, default: 0 },
  basicSalary: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  conveyance: { type: Number, default: 0 },
  specialAllowance: { type: Number, default: 0 },
  pfNumber: { type: String, default: '' },
  esicNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  bankName: { type: String, default: '' },
  bankAccount: { type: String, default: '' },
  ifscCode: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
