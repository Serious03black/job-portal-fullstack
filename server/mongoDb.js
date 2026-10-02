const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Leave = require('./models/Leave');
const Attendance = require('./models/Attendance');

const seedUsers = [
  {
    id: "usr_admin_1",
    role: "admin",
    name: "Super Admin",
    email: "admin@axytes.in",
    password: "admin123",
    designation: "HR Operations Head"
  },
  {
    id: "usr_emp_1",
    role: "employee",
    code: "AXY-2024-089",
    name: "Rahul Sharma",
    email: "rahul.sharma@axytes.in",
    password: "emp123",
    designation: "Senior Production Supervisor",
    clientSite: "Tata Motors Plant, Pune",
    joiningDate: "2023-01-12",
    grossSalary: 35000,
    basicSalary: 18000,
    hra: 9000,
    conveyance: 3000,
    specialAllowance: 5000,
    pfNumber: "101489201948",
    esicNumber: "31049281900010",
    panNumber: "ABCPS8492K",
    bankName: "HDFC Bank Ltd.",
    bankAccount: "50100239847112",
    ifscCode: "HDFC0001824"
  },
  {
    id: "usr_cand_1",
    role: "candidate",
    name: "Rahul Sharma",
    email: "candidate@example.com",
    password: "candidate123",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra",
    experience: "5 Years",
    currentCtc: "₹ 4,80,000 / year",
    expectedCtc: "₹ 6,50,000 / year",
    noticePeriod: "15 Days",
    skills: ["CNC Programming", "Shop Floor Management", "Lean Six Sigma", "ISO 9001", "5S & Kaizen"],
    resumeName: "Rahul_Sharma_Resume_2024.pdf"
  }
];

const seedJobs = [
  {
    id: "JOB-2024-001",
    title: "Production Supervisor",
    company: "Leading Automotive OEM",
    location: "Pune, Maharashtra",
    type: "Full-time",
    category: "Manufacturing",
    salary: "₹25,000 – ₹35,000 / mo",
    experience: "3 – 5 Years",
    openings: 4,
    status: "Active",
    description: "Manage daily manufacturing shop floor operations, oversee CNC machinery lines, ensure worker safety and daily output quotas.",
    skills: ["Shop Floor Management", "5S", "CNC", "Quality Audits"],
    postedDate: "2024-09-15"
  },
  {
    id: "JOB-2024-002",
    title: "Full Stack Java Developer",
    company: "FinTech Client Services",
    location: "Mumbai, Maharashtra (Hybrid)",
    type: "Full-time",
    category: "IT & Technology",
    salary: "₹65,000 – ₹90,000 / mo",
    experience: "4 – 7 Years",
    openings: 2,
    status: "Active",
    description: "Develop enterprise banking microservices using Spring Boot, React.js, PostgreSQL, and AWS Cloud infrastructure.",
    skills: ["Java", "Spring Boot", "React", "Microservices", "PostgreSQL"],
    postedDate: "2024-09-18"
  },
  {
    id: "JOB-2024-003",
    title: "Warehouse & Logistics Executive",
    company: "3PL Supply Chain Leader",
    location: "Bhiwandi, Thane",
    type: "Contract",
    category: "Logistics",
    salary: "₹18,000 – ₹25,000 / mo",
    experience: "2 – 4 Years",
    openings: 8,
    status: "Active",
    description: "Oversee inventory stocking, barcode inbound/outbound scanning, warehouse management systems (WMS) and vendor dispatch coordination.",
    skills: ["WMS", "Inventory Control", "Dispatch", "Logistics"],
    postedDate: "2024-09-22"
  },
  {
    id: "JOB-2024-004",
    title: "Branch Relationship Manager",
    company: "Private Sector Bank",
    location: "Navi Mumbai, Maharashtra",
    type: "Full-time",
    category: "BFSI",
    salary: "₹28,000 – ₹40,000 / mo",
    experience: "2 – 5 Years",
    openings: 5,
    status: "Active",
    description: "Drive retail banking client relationships, cross-sell insurance and mutual funds products, maintain high client satisfaction scores.",
    skills: ["Banking Operations", "KYC", "Wealth Products", "Sales"],
    postedDate: "2024-09-25"
  },
  {
    id: "JOB-2024-005",
    title: "Quality Control (QC) Inspector",
    company: "Precision Engineering Works",
    location: "Chakan, Pune",
    type: "Full-time",
    category: "Manufacturing",
    salary: "₹20,000 – ₹28,000 / mo",
    experience: "1 – 3 Years",
    openings: 3,
    status: "Active",
    description: "Perform precision measurements using Vernier calipers, micrometers, and CMM machines on automotive pressed parts.",
    skills: ["QC Inspection", "Instruments", "ISO 9001", "Reports"],
    postedDate: "2024-09-28"
  }
];

async function seedMongoDB() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(seedUsers);
      console.log('🌱 MongoDB seeded with default users (Admin, Employee, Candidate).');
    }

    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.insertMany(seedJobs);
      console.log('🌱 MongoDB seeded with default jobs.');
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err.message);
  }
}

async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI not found in environment variables. Falling back to local db.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB Atlas cluster successfully!');
    await seedMongoDB();
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.warn('⚠️ Please check IP Whitelist (0.0.0.0/0) in MongoDB Atlas Network Access.');
    return false;
  }
}

module.exports = {
  connectMongoDB
};
