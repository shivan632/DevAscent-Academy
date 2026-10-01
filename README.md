# DevAscent Academy — Next-Gen EdTech & Virtual Internship Platform

<div align="center">
  <img src="frontend/public/logo.png" alt="DevAscent Academy Logo" width="100" />
  
  ### Empowering Next-Gen Engineers Through Production-Grade Practical Learning
  
  [![Live Website](https://img.shields.io/badge/Live-dev--ascent--academy.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://dev-ascent-academy.vercel.app)
  [![Backend API](https://img.shields.io/badge/API-devascent--academy.onrender.com-00C7B7?style=for-the-badge&logo=render&logoColor=white)](https://devascent-academy.onrender.com)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
  [![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
  [![Neon Postgres](https://img.shields.io/badge/Neon-Serverless_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
</div>

---

## 📑 Table of Contents

- [🏛️ Company Overview](#️-company-overview)
- [🌐 Live Infrastructure & Core Links](#-live-infrastructure--core-links)
- [⚡ Technology Stack](#-technology-stack)
- [🎓 How It Works for Students (Step-by-Step)](#-how-it-works-for-students-step-by-step)
- [📊 System Architecture & Flowcharts](#-system-architecture--flowcharts)
  - [1. Authentication & OTP Verification Flow](#1-authentication--otp-verification-flow)
  - [2. Course Discovery & Razorpay Payment Flow](#2-course-discovery--razorpay-payment-flow)
  - [3. Interactive Learning & AI Copilot Flow](#3-interactive-learning--ai-copilot-flow)
  - [4. Capstone Submission & Certificate Issuance Flow](#4-capstone-submission--certificate-issuance-flow)
- [🛡️ Tamper-Proof Certificate & Verification System](#️-tamper-proof-certificate--verification-system)
- [💼 Admin Command Center](#-admin-command-center)
- [🚀 Local Development & Setup](#-local-development--setup)
- [📦 Deployment Architecture](#-deployment-architecture)
- [👥 Leadership & Contact](#-leadership--contact)

---

## 🏛️ Company Overview

**DevAscent Academy** is an accredited technology training and virtual internship platform built for aspiring developers, computer science students, and engineering professionals. We bridge the gap between theoretical academic curriculums and high-scale production engineering.

### 🌟 Core Value Propositions
- **Hands-on Virtual Internships**: Real-world capstone projects spanning full-stack development, algorithmic systems, AI engineering, and modern cloud architectures.
- **AI-Powered Code Mentor**: Built-in 24/7 AI learning copilot that provides instant code reviews, debugging assistance, and conceptual guidance.
- **Tamper-Proof Digital Credentials**: High-resolution luxury dark-mode PDF certificates embedded with cryptographic SHA-256 signatures and instant public verification QR codes.
- **7-Day Transparent Guarantee**: Built-in automated refund tracking system ensuring student protection and peace of mind.

---

## 🌐 Live Infrastructure & Core Links

| Service | Destination / URL | Provider |
|---|---|---|
| **Frontend Web App** | [https://dev-ascent-academy.vercel.app](https://dev-ascent-academy.vercel.app) | Vercel Edge CDN |
| **Backend REST API** | [https://devascent-academy.onrender.com/api/v1](https://devascent-academy.onrender.com/api/v1) | Render Cloud Services |
| **Serverless Database** | Neon PostgreSQL (Pooled + SSL) | Neon AWS US-East-2 |
| **Email Gateway** | Resend HTTP API + Gmail SMTP Dual-Stack | Resend DNS Verified Domain |
| **Public Verification** | `https://dev-ascent-academy.vercel.app/verify/:certId` | DevAscent Public Ledger |

---

## ⚡ Technology Stack

### Frontend Architecture
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Hydration)
- **Styling & Design System**: Tailwind CSS, CSS Custom Properties, Lucide Icons, Framer Motion-inspired animations
- **State & Data Fetching**: Zustand, SWR (stale-while-revalidate), React Hook Form, Zod validation
- **PDF & QR Visualization**: Native canvas, dynamic download handlers, Lucide React

### Backend Architecture
- **Framework**: [NestJS 10](https://nestjs.com/) (Modular Architecture, Dependency Injection)
- **ORM & Database**: Prisma ORM with [Neon Serverless Postgres](https://neon.tech/)
- **Security & Auth**: JWT (Access & Refresh Tokens in HttpOnly secure cookies), Bcrypt password hashing, Google OAuth 2.0
- **Email Dispatch**: Resend HTTP API (Port 443 HTTPS firewall-proof) with automated Gmail SMTP fallback
- **Certificate Engine**: PDFKit vector engine with dynamic QR code generation (`qrcode`) and cryptographic SHA-256 hashing

---

## 🎓 How It Works for Students (Step-by-Step)

```
   [ 1. Explore & Register ]
              │
              ▼
   [ 2. 6-Digit Email OTP Verification ]
              │
              ▼
   [ 3. Enroll / Instant Razorpay Checkout ]
              │
              ▼
   [ 4. Unlock Interactive Modules & Video Lessons ]
              │
              ▼
   [ 5. Ask Questions & AI Copilot Debugging ]
              │
              ▼
   [ 6. Complete Capstone Project & Submit Repository ]
              │
              ▼
   [ 7. Admin Review & Grade Assignment ]
              │
              ▼
   [ 8. Receive Tamper-Proof Certificate (PDF + Live QR) ]
```

1. **Sign Up & Email Verification**: Students register using their academic or personal email. A non-blocking 6-digit OTP is instantly dispatched to their inbox.
2. **Browse Curriculum & Enroll**: Students browse accredited cohorts (Python, Full-Stack Web Development, AI Engineering, etc.) and complete enrollment via Razorpay secure checkout.
3. **Structured Learning**: Access module lessons, video lectures, coding quizzes, and downloadable resources in the dedicated LMS classroom.
4. **AI Studio & Doubt Resolution**: When stuck on bugs or syntax errors, students can use the AI Studio Copilot or submit doubts directly to instructors.
5. **Capstone Submission**: After finishing curriculum modules, students submit their production repository (GitHub URL) and live demo deployment.
6. **Instructor Review & Certification**: Once approved by the lead instructor, a luxury dark-mode PDF certificate with embedded QR verification is automatically minted, emailed, and added to the student profile.

---

## 📊 System Architecture & Flowcharts

### 1. Authentication & OTP Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as 👨‍🎓 Student
    participant Client as 🖥️ Next.js Frontend
    participant API as ⚙️ NestJS Auth Service
    participant Resend as 📧 Resend HTTP Gateway
    participant DB as 🗄️ Neon PostgreSQL

    Student->>Client: Enters Name, Email, Password
    Client->>API: POST /api/v1/auth/register
    API->>DB: Check if user exists & hash password
    API->>DB: Upsert 6-digit OTP (15 min expiry)
    API-->>Client: Return instant 200 OK (<100ms)
    API-)Resend: Async sendOtpEmail() via HTTPS 443
    Resend-->>Student: Delivers OTP to Student Inbox
    Student->>Client: Enters 6-digit OTP
    Client->>API: POST /api/v1/auth/verify-otp
    API->>DB: Validate OTP code & check max attempts
    API->>DB: Mark isEmailVerified = true
    API-->>Client: Set HttpOnly JWT access & refresh cookies
    Client-->>Student: Redirect to Student Dashboard
```

---

### 2. Course Discovery & Razorpay Payment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as 👨‍🎓 Student
    participant Client as 🖥️ Next.js Frontend
    participant API as ⚙️ NestJS Payments Service
    participant Razorpay as 💳 Razorpay Gateway
    participant DB as 🗄️ Neon PostgreSQL

    Student->>Client: Selects Cohort & clicks "Enroll Now"
    Client->>API: POST /api/v1/payments/create-order
    API->>Razorpay: Create Order with amountInPaise
    Razorpay-->>API: Returns razorpayOrderId
    API-->>Client: Returns Order ID, Key, and Price details
    Client->>Razorpay: Opens Razorpay Checkout Modal (UPI, Cards, NetBanking)
    Student->>Razorpay: Authorizes Payment
    Razorpay-->>Client: Returns paymentId & signature
    Client->>API: POST /api/v1/payments/verify
    API->>API: Cryptographic HMAC SHA-256 signature verification
    API->>DB: Create Enrollment record & record Payment transaction
    API-->>Client: Success response
    Client-->>Student: Instant access to LMS Classroom & Modules
```

---

### 3. Interactive Learning & AI Copilot Flow

```mermaid
flowchart TD
    A[👨‍🎓 Student Enters LMS Track] --> B[📺 Watch Module Video & Read Lesson Content]
    B --> C{Got a Question or Bug?}
    C -->|Yes: Need Instant Help| D[🤖 AI Studio Copilot]
    D --> E[💡 Receive Context-Aware Code Fix & Explanations]
    E --> B
    C -->|Yes: Ask Instructor| F[❓ Submit Lesson Doubt Ticket]
    F --> G[👨‍🏫 Instructor Resolves & Replies]
    G --> B
    C -->|No: Ready for Evaluation| H[📝 Take Module Quiz & Complete Challenges]
    H --> I{Passed Module Quiz?}
    I -->|No| H
    I -->|Yes| J[🚀 Unlock Next Module / Capstone Submission]
```

---

### 4. Capstone Submission & Certificate Issuance Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as 👨‍🎓 Student
    participant Client as 🖥️ Next.js Frontend
    participant Admin as 👨‍💼 Admin Command Center
    participant API as ⚙️ NestJS Certificate Service
    participant PDF as 📄 PDFKit Vector Engine
    participant Resend as 📧 Resend Gateway
    participant DB as 🗄️ Neon PostgreSQL

    Student->>Client: Submits GitHub Repo + Demo URL + Notes
    Client->>API: POST /api/v1/submissions
    API->>DB: Save CompletionSubmission (Status: PENDING)
    Admin->>API: GET /api/v1/admin/submissions
    Admin->>API: POST /api/v1/admin/submissions/:id/review (Status: APPROVED, Grade: A+)
    API->>DB: Update Submission status & Generate unique certId
    API->>DB: Compute SHA-256 hash & save Certificate record
    API->>PDF: generatePdfBuffer(certId, recipientName, courseTitle, grade)
    PDF-->>API: High-Resolution Luxury Dark-Mode PDF Buffer
    API-)Resend: sendCertificateEmail() with PDF attachment
    Resend-->>Student: Certificate delivered to inbox
    Student->>Client: Downloads PDF or shares public verification link
```

---

## 🛡️ Tamper-Proof Certificate & Verification System

Every credential generated by DevAscent Academy features multi-layered verification:

```
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   1. Tamper-Proof Cryptographic ID: DEV-BATCH12-8B9E73               ║
║   2. SHA-256 Hash Digest: Stored in immutable database record         ║
║   3. Embedded Scannable QR Code: Points directly to public ledger     ║
║   4. Live Public URL: https://dev-ascent-academy.vercel.app/verify/   ║
║   5. Gold Foil Medallion Official Seal + Verified Founder Signature   ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### Public Verification Endpoint
- Anyone (recruiters, universities, employers) can scan the QR code or visit:
  `https://dev-ascent-academy.vercel.app/verify/:certId`
- The system checks the database in real-time and renders a verified badge with student name, track title, issue date, grade, and credential status.

---

## 💼 Admin Command Center

DevAscent Academy includes an enterprise admin portal located at `/admin`:

- **📊 Dashboard & Metrics**: Real-time revenue analytics, active students, enrollment velocity, and completion rates.
- **📖 Course & Curriculum Builder**: Create and edit courses, video modules, lessons, quizzes, and cohort limits.
- **👥 Student Directory**: View registered users, verification statuses, and enrolled tracks.
- **📋 Enrollments Manager**: Track student progress percentages, activation statuses, and enrolled dates.
- **✅ Capstone Review Queue**: Review student project submissions, assign grades (`Distinction (A+)`, `A`, `B`), and approve certificates.
- **💳 Payments & Refunds**: Monitor Razorpay transactions and process student 7-day refund requests.
- **📜 System Audit Logs**: Comprehensive audit trail of all administrative actions.

---

## 🚀 Local Development & Setup

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- PostgreSQL or Neon Serverless Postgres instance
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/shivan632/DevAscent-Academy.git
cd DevAscent-Academy
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
```

Configure `backend/.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

JWT_SECRET="your-64-character-jwt-secret"
JWT_REFRESH_SECRET="your-64-character-jwt-refresh-secret"

RESEND_API_KEY="re_your_resend_key"
RESEND_FROM="DevAscent Academy <noreply@devascentacademy.me>"
EMAIL_FROM="DevAscent Academy <your-email@gmail.com>"

RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
```

Generate Prisma client & run database migrations:
```bash
npx prisma generate
npx prisma db push
```

Start the NestJS backend:
```bash
npm run start:dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install

# Start Next.js development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Deployment Architecture

```
                 ┌────────────────────────────────┐
                 │       🌐 Vercel Edge CDN       │
                 │   (Next.js 14 Frontend App)    │
                 │ dev-ascent-academy.vercel.app  │
                 └───────────────┬────────────────┘
                                 │ HTTPS REST API
                                 ▼
                 ┌────────────────────────────────┐
                 │      ⚙️ Render Web Service      │
                 │    (NestJS REST API Engine)    │
                 │ devascent-academy.onrender.com │
                 └───────────────┬────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 🗄️ Neon Postgres  │    │ 📧 Resend Engine  │    │ 💳 Razorpay API  │
│ (Pooled Cloud DB)│    │ (HTTPS Port 443) │    │(Payments/Refunds)│
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

---

## 👥 Leadership & Contact

- **Founder & Lead Instructor**: Shivan Mishra
- **Official Website**: [https://dev-ascent-academy.vercel.app](https://dev-ascent-academy.vercel.app)
- **Domain**: `devascentacademy.me`
- **Support & Inquiries**: `shivrom.2020@gmail.com`

<div align="center">
  <sub>© 2026 DevAscent Academy. All rights reserved. Empowering Next-Gen Engineers.</sub>
</div>
