require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./server/db');
const { connectMongoDB } = require('./server/mongoDb');

// Initialize database
getDb();
connectMongoDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname)));

// API Routers
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/jobs', require('./server/routes/jobs'));
app.use('/api/candidates', require('./server/routes/candidates'));
app.use('/api/employees', require('./server/routes/employees'));
app.use('/api/admin', require('./server/routes/admin'));
app.use('/api/leads', require('./server/routes/leads'));

// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AXYTES Staffing & Recruitment Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Documentation / Directory Route
app.get('/api', (req, res) => {
  res.json({
    platform: 'AXYTES Solutions Private Limited - REST API',
    version: '1.0.0',
    documentation: {
      auth: {
        candidateLogin: 'POST /api/auth/candidate/login',
        candidateRegister: 'POST /api/auth/candidate/register',
        employeeLogin: 'POST /api/auth/employee/login',
        adminLogin: 'POST /api/auth/admin/login'
      },
      jobs: {
        listJobs: 'GET /api/jobs?kw=&loc=&cat=&type=',
        getJob: 'GET /api/jobs/:id',
        createJob: 'POST /api/jobs (Admin)',
        updateJob: 'PUT /api/jobs/:id (Admin)',
        deleteJob: 'DELETE /api/jobs/:id (Admin)'
      },
      candidates: {
        getProfile: 'GET /api/candidates/profile/:id',
        updateProfile: 'PUT /api/candidates/profile/:id',
        applyJob: 'POST /api/candidates/apply',
        getApplications: 'GET /api/candidates/applications/:candidateId'
      },
      employees: {
        getProfile: 'GET /api/employees/profile/:code',
        checkIn: 'POST /api/employees/attendance/check-in',
        checkOut: 'POST /api/employees/attendance/check-out',
        getAttendance: 'GET /api/employees/attendance/:code',
        getLeaves: 'GET /api/employees/leaves/:code',
        applyLeave: 'POST /api/employees/leaves',
        getPayslips: 'GET /api/employees/payslips/:code'
      },
      admin: {
        dashboardKpis: 'GET /api/admin/dashboard',
        listCandidates: 'GET /api/admin/candidates?q=&loc=&skill=',
        updateApplicationStage: 'PUT /api/admin/applications/:id/status',
        processLeave: 'PUT /api/admin/leaves/:id',
        reports: 'GET /api/admin/reports'
      },
      leads: {
        employerRequest: 'POST /api/leads/employer-request',
        contactInquiry: 'POST /api/leads/contact'
      }
    }
  });
});

// Fallback to index.html for root navigation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 AXYTES Backend Server is running on port ${PORT}`);
  console.log(`🌐 Website & Portals: http://localhost:${PORT}`);
  console.log(`📚 API Documentation:  http://localhost:${PORT}/api`);
  console.log(`🩺 Health Status:      http://localhost:${PORT}/health`);
  console.log('====================================================');
});
