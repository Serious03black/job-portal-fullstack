const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  employeeCode: { type: String, required: true },
  date: { type: String, required: true },
  checkIn: { type: String, default: null },
  checkOut: { type: String, default: null },
  status: { type: String, default: 'Present' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
