# AXYTES Solutions Private Limited
## Full-Stack Website, Digital Recruitment Platform & Employee Self-Service (ESS) Portal

An enterprise-grade staffing, recruitment, manpower supply, and payroll platform built for **AXYTES Solutions Private Limited**.

---

## ⚡ Quick Start: Running the Full-Stack Server

The application includes an integrated **Node.js + Express REST API Backend** that serves all frontend portals and powers real-time authentication, job postings, candidate applications, and employee payroll records.

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
# or in development auto-reload mode
npm run dev
```

Once started, access the platform at:
- **🌐 Website & Portals**: [http://localhost:5000](http://localhost:5000)
- **📚 API Interactive Directory**: [http://localhost:5000/api](http://localhost:5000/api)
- **🩺 Health Check Endpoint**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 📂 Architecture & Directory Structure

```text
pallavi project/
├── server.js                      # Master Express server & static asset host
├── package.json                   # Backend dependencies (Express, CORS)
├── server/
│   ├── db.js                      # Database layer with auto-persistence (server/data/db.json)
│   ├── routes/
│   │   ├── auth.js                # Candidate, Employee & Admin authentication
│   │   ├── jobs.js                # Job postings CRUD, keyword search & filtering
│   │   ├── candidates.js          # Profile management, job application & status tracking
│   │   ├── employees.js           # Attendance clock-in/out, leave requests & payslips
│   │   ├── admin.js               # Executive KPIs, candidate pool, leave approvals, reports
│   │   └── leads.js               # Contact inquiries & employer talent requisitions
├── index.html                     # Corporate Homepage
├── about.html                     # About Us (Story, Leadership, Mission & Values)
├── services.html                  # Core Services & interactive Cost Estimator
├── industries.html                # Industry Verticals (Manufacturing, IT, BFSI, Logistics)
├── employers.html                 # For Employers (Talent Requisition form, Staffing models)
├── careers.html                   # Internal Careers at AXYTES (Recruiter openings)
├── jobs.html                      # Public Job Board with live search and filter
├── contact.html                   # Contact Us (Branch offices, inquiry form)
├── privacy.html                   # Privacy Policy (IT Act 2000 & GDPR compliance)
├── terms.html                     # Terms & Conditions (Candidate Zero-Fee terms, Client SLA)
├── disclaimer.html                # Corporate Disclaimer & Recruitment Fraud Alert
├── css/
│   └── styles.css                 # Complete responsive CSS design system
├── candidate/
│   ├── login.html                 # Candidate authentication
│   ├── register.html              # Candidate sign up
│   ├── dashboard.html             # Application pipeline & status tracker
│   ├── profile.html               # Candidate profile & resume management
│   ├── job-search.html            # Candidate portal job search
│   └── applied-jobs.html          # Applied openings progress tracker
├── employee/
│   ├── login.html                 # ESS Portal login
│   ├── dashboard.html             # 1-click check-in/out, leave balance, payslips
│   ├── leave.html                 # Leave management & application form
│   ├── salary.html                # Detailed earnings, deductions & PDF payslip download
│   └── profile.html               # Bank details, PF / ESIC, and company handbook
└── admin/
    ├── login.html                 # Admin authentication with security notice
    ├── dashboard.html             # Executive KPIs, interviews today, quick actions
    ├── candidates.html            # Candidate database search & resume lookup
    ├── jobs.html                  # Post & manage jobs, applicant counter, close/reopen
    ├── employees.html             # Employee roster & Leave Approval workflow
    └── reports.html               # Monthly placement bar charts & sector breakdown
```

---

## 🔌 REST API Endpoints Overview

### 1. Authentication (`/api/auth`)
- `POST /api/auth/candidate/login` — Authenticate job seekers
- `POST /api/auth/candidate/register` — Register new candidates
- `POST /api/auth/employee/login` — Authenticate employees via Code/Email
- `POST /api/auth/admin/login` — Authenticate administrators

### 2. Jobs (`/api/jobs`)
- `GET /api/jobs` — Filter jobs by `kw` (keyword), `loc` (location), `cat` (category), `type` (Full-time/Contract)
- `GET /api/jobs/:id` — Get single job details
- `POST /api/jobs` — Create new job opening *(Admin)*
- `PUT /api/jobs/:id` — Update job details / toggle active status *(Admin)*
- `DELETE /api/jobs/:id` — Remove job posting *(Admin)*

### 3. Candidates (`/api/candidates`)
- `GET /api/candidates/profile/:id` — Fetch candidate profile and resume details
- `PUT /api/candidates/profile/:id` — Update experience, salary expectation, notice period, skills
- `POST /api/candidates/apply` — Apply to a job posting
- `GET /api/candidates/applications/:candidateId` — View application stages *(Applied ➔ Shortlisted ➔ Interview Scheduled ➔ Selected)*

### 4. Employees (`/api/employees`)
- `GET /api/employees/profile/:code` — Profile, salary bank account, PF (UAN) & ESIC
- `POST /api/employees/attendance/check-in` — Clock in attendance
- `POST /api/employees/attendance/check-out` — Clock out attendance
- `GET /api/employees/attendance/:code` — Attendance history
- `GET /api/employees/leaves/:code` — Leave balance & request log
- `POST /api/employees/leaves` — Apply for leave
- `GET /api/employees/payslips/:code` — Detailed monthly salary breakdown & deductions

### 5. Admin & HR Management (`/api/admin`)
- `GET /api/admin/dashboard` — Live counts (Active jobs, candidates, employees, pending leaves)
- `GET /api/admin/candidates` — Filterable candidate repository
- `PUT /api/admin/applications/:id/status` — Advance candidate pipeline stage
- `PUT /api/admin/leaves/:id` — Approve or Reject pending leave requests
- `GET /api/admin/reports` — Monthly hiring velocity, industry sector breakdown

### 6. Leads & Inquiries (`/api/leads`)
- `POST /api/leads/employer-request` — Log talent requisition from employers
- `POST /api/leads/contact` — Log general inquiry from contact page
- `GET /api/leads/employer-requests` — List client staffing requests
- `GET /api/leads/contact-inquiries` — List public messages

---

## 🔑 Demo Login Credentials

| Role | Login URL | Default Username / Email | Default Password | Quick Login Available? |
| :--- | :--- | :--- | :--- | :---: |
| **Admin** | [`admin/login.html`](file:///d:/C%20Drive/pallavi%20project/admin/login.html) | `admin@axytes.in` | `admin123` | ✅ Yes |
| **Employee** | [`employee/login.html`](file:///d:/C%20Drive/pallavi%20project/employee/login.html) | `AXY-2024-089` | `emp123` | ✅ Yes |
| **Candidate**| [`candidate/login.html`](file:///d:/C%20Drive/pallavi%20project/candidate/login.html) | `candidate@example.com` | `candidate123` | ✅ Yes |

---

## 🛡 Security & Compliance Highlights
1. **Statutory & Regulatory Alignment**: Adheres to Indian Labour Laws (EPF Act, ESI Act, Payment of Bonus Act, Gratuity Act).
2. **IT Act 2000 Compliance**: Clear data retention and grievance officer disclosure.
3. **Zero-Fee Candidate Guarantee**: Publicly announced fraud alert protecting candidates against fraudulent recruiters.

---

© 2024 **AXYTES Solutions Private Limited**. All Rights Reserved.
