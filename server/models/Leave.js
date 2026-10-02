const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  employeeCode: { type: String, required: true },
  employeeName: { type: String, required: true },
  clientSite: { type: String, default: 'Client Site' },
  leaveType: { type: String, default: 'Casual Leave' },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  days: { type: Number, default: 1 },
  reason: { type: String, default: '' },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  appliedOn: { type: String, default: () => new Date().toISOString().split('T')[0] },
  processedAt: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('Leave', LeaveSchema);
