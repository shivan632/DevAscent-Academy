import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DevAscent Academy database with Virtual Internships and Engineering Courses...');

  // 1. Clean existing records (in reverse dependency order)
  await prisma.completionSubmission.deleteMany();
  await prisma.internshipApplication.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.quizSubmission.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const adminPasswordHash = await bcrypt.hash('Shivan@20122005', 12);
  const studentPasswordHash = await bcrypt.hash('StudentPassword@123', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'shivrom.2020@gmail.com',
      passwordHash: adminPasswordHash,
      name: 'Shivan Mishra',
      phone: '+91 99358 06722',
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@devascent.io',
      passwordHash: studentPasswordHash,
      name: 'Aarav Sharma',
      phone: '+91 91234 56789',
      role: 'STUDENT',
      degree: 'BCA',
      college: 'Bangalore City University',
      isEmailVerified: true,
    },
  });

  console.log(`Created users: Admin (${admin.email}), Student (${student.email})`);

  // 3. Complete Catalog of Virtual Internships & Courses
  const coursesToCreate = [
    {
      slug: 'web-development-internship',
      title: 'Web Development Virtual Internship',
      description: 'Hands-on web development internship covering HTML5, CSS3, JavaScript ES6+, React, DOM manipulation, responsive layouts, and Git version control.',
      priceInPaise: 99900,
      earlyBirdPriceInPaise: 29900,
      domain: 'frontend',
      level: 'Beginner to Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 12,
      seatsRemaining: 45,
      totalSeats: 60,
      cohortStartsOn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['Responsive Web Design & Modern CSS', 'DOM Manipulation & ES6+ JavaScript', 'Interactive React Components', 'Deploying on Vercel/GitHub Pages']),
      projects: JSON.stringify(['Landing Page Architecture', 'Personal Portfolio with Interactive Theme', 'Calculator / Dynamic Web App']),
      assignments: JSON.stringify(['Task 1: Landing Page Build', 'Task 2: Portfolio Website', 'Task 3: Dynamic Web App']),
      requirements: JSON.stringify(['Basic understanding of HTML and web concepts', 'Computer with text editor (VS Code)']),
    },
    {
      slug: 'python-programming-internship',
      title: 'Python Programming Virtual Internship',
      description: 'Master Python fundamentals, data structures, automation scripts, Tkinter desktop GUIs, and web scrapers. Build 3 production utilities.',
      priceInPaise: 79900,
      earlyBirdPriceInPaise: 19900,
      domain: 'python',
      level: 'Beginner to Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 15,
      seatsRemaining: 30,
      totalSeats: 50,
      cohortStartsOn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['Core Python Syntax, Loops & Functions', 'Object-Oriented Programming (OOP)', 'GUI Development with Tkinter', 'Web Scraping with BeautifulSoup']),
      projects: JSON.stringify(['To-Do List GUI Application', 'Password Generator & Strength Meter', 'Rock-Paper-Scissors / Contact Book']),
      assignments: JSON.stringify(['Task 1: To-Do List App', 'Task 2: Password Generator', 'Task 3: Rock-Paper-Scissors Game']),
      requirements: JSON.stringify(['Basic computer literacy and enthusiasm to code in Python']),
    },
    {
      slug: 'java-programming-internship',
      title: 'Java Programming Virtual Internship',
      description: 'Object-Oriented Programming (OOP), Collections framework, exception handling, Swing desktop GUIs, and JDBC database connectivity.',
      priceInPaise: 89900,
      earlyBirdPriceInPaise: 24900,
      domain: 'java',
      level: 'Beginner to Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 11,
      seatsRemaining: 20,
      totalSeats: 40,
      cohortStartsOn: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['Java OOP Principles (Encapsulation, Polymorphism)', 'Exception Handling & Collections Framework', 'Desktop GUI with Java Swing', 'Database Connectivity via JDBC']),
      projects: JSON.stringify(['Number Guessing Game with Scoring', 'Student Grade Calculator & Registry', 'ATM Interface with Account Operations']),
      assignments: JSON.stringify(['Task 1: Number Game', 'Task 2: Student Grade Calculator', 'Task 3: ATM Interface']),
      requirements: JSON.stringify(['JDK 17+ and any IDE (Eclipse / IntelliJ / VS Code)']),
    },
    {
      slug: 'cpp-programming-internship',
      title: 'C++ Programming Virtual Internship',
      description: 'Deep dive into C++ syntax, pointers, memory allocation, Object-Oriented Design, and Standard Template Library (STL) algorithms.',
      priceInPaise: 69900,
      earlyBirdPriceInPaise: 19900,
      domain: 'cpp',
      level: 'Beginner to Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 9,
      seatsRemaining: 25,
      totalSeats: 45,
      cohortStartsOn: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['Pointers, Dynamic Memory & References', 'Class Design & Operator Overloading', 'STL Containers, Iterators & Algorithms', 'Performance Profiling & Compilation']),
      projects: JSON.stringify(['Number Guessing Game', 'Simple Arithmetic & Scientific Calculator', 'Tic-Tac-Toe Game with AI / 2-Player']),
      assignments: JSON.stringify(['Task 1: Number Guessing Game', 'Task 2: Simple Calculator', 'Task 3: Tic-Tac-Toe Game']),
      requirements: JSON.stringify(['C++ compiler (GCC / Clang / MSVC)']),
    },
    {
      slug: 'android-app-development-internship',
      title: 'Android App Development Virtual Internship',
      description: 'Develop native Android apps using Android Studio, Kotlin/Java, XML/Jetpack Compose, Room SQLite, and REST API consumption with Retrofit.',
      priceInPaise: 129900,
      earlyBirdPriceInPaise: 39900,
      domain: 'android',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 7,
      seatsRemaining: 18,
      totalSeats: 35,
      cohortStartsOn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['Android UI Design & Activity Lifecycle', 'Intent Navigation & Fragment Architecture', 'Local Persistence with Room & SQLite', 'REST API Integration with Retrofit']),
      projects: JSON.stringify(['Unit Converter / Quiz App', 'Quote of the Day App with REST API', 'Personal Expense Tracker / Task Manager']),
      assignments: JSON.stringify(['Task 1: Quiz App', 'Task 2: Quote of the Day App', 'Task 3: Expense Tracker']),
      requirements: JSON.stringify(['Android Studio installed on a PC with 8GB+ RAM']),
    },
    {
      slug: 'data-science-internship',
      title: 'Data Science & Analytics Virtual Internship',
      description: 'End-to-end data analytics workflow using Python, Pandas, NumPy, Matplotlib, Seaborn, exploratory data analysis (EDA), and machine learning regression algorithms.',
      priceInPaise: 149900,
      earlyBirdPriceInPaise: 49900,
      domain: 'data-science',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 10,
      seatsRemaining: 22,
      totalSeats: 40,
      cohortStartsOn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['Data Cleaning & Wrangling with Pandas', 'Exploratory Data Analysis (EDA)', 'Statistical Modeling & Hypothesis Testing', 'Interactive Visualizations with Seaborn & Plotly']),
      projects: JSON.stringify(['Titanic Survival Prediction (Classification)', 'Movie Rating Prediction with Regression', 'Iris Flower Classification / Sales Prediction']),
      assignments: JSON.stringify(['Task 1: Titanic Survival Model', 'Task 2: Movie Rating Analysis', 'Task 3: Iris Classification']),
      requirements: JSON.stringify(['Basic Python and Jupyter Notebook or Google Colab']),
    },
    {
      slug: 'machine-learning-internship',
      title: 'Machine Learning Virtual Internship',
      description: 'Train, evaluate, and fine-tune predictive models with Scikit-Learn, Random Forests, Decision Trees, Supervised Learning, and Kaggle competitive datasets.',
      priceInPaise: 179900,
      earlyBirdPriceInPaise: 59900,
      domain: 'ai-ml',
      level: 'Intermediate to Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 8,
      seatsRemaining: 15,
      totalSeats: 30,
      cohortStartsOn: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['Supervised & Unsupervised Learning Algorithms', 'Feature Engineering & Cross-Validation', 'Hyperparameter Tuning with GridSearch', 'Model Deployment via FastAPI / Flask']),
      projects: JSON.stringify(['Credit Card Fraud Detection', 'Spam SMS Classifier with NLP', 'Customer Churn Prediction Engine']),
      assignments: JSON.stringify(['Task 1: Fraud Detection Model', 'Task 2: Spam SMS Classifier', 'Task 3: Customer Churn Prediction']),
      requirements: JSON.stringify(['Python programming and basic linear algebra understanding']),
    },
    {
      slug: 'artificial-intelligence-internship',
      title: 'Artificial Intelligence Virtual Internship',
      description: 'Build intelligent systems with Natural Language Processing (NLP), rule-based chatbots, Computer Vision with OpenCV, and OpenAI API workflows.',
      priceInPaise: 199900,
      earlyBirdPriceInPaise: 59900,
      domain: 'ai-ml',
      level: 'Intermediate to Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 6,
      seatsRemaining: 14,
      totalSeats: 30,
      cohortStartsOn: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['Natural Language Processing (NLP) & Tokenization', 'Deep Learning Basics with PyTorch / Keras', 'Rule-Based & Generative AI Chatbots', 'Computer Vision with OpenCV']),
      projects: JSON.stringify(['Rule-Based AI Chatbot', 'Tic-Tac-Toe AI with Minimax Algorithm', 'Face Detection / Image Classifier']),
      assignments: JSON.stringify(['Task 1: AI Chatbot', 'Task 2: Minimax Tic-Tac-Toe', 'Task 3: Face Detection System']),
      requirements: JSON.stringify(['Python and introductory Machine Learning concepts']),
    },
    {
      slug: 'ui-ux-design-internship',
      title: 'UI/UX Design Virtual Internship',
      description: 'Master UI/UX workflow with Figma, wireframing, component-driven design systems, user personas, UX heuristics, and clickable interactive prototypes.',
      priceInPaise: 99900,
      earlyBirdPriceInPaise: 29900,
      domain: 'design',
      level: 'Beginner to Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c93269c3?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 9,
      seatsRemaining: 28,
      totalSeats: 50,
      cohortStartsOn: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Verified Certificate + LOR + Task Assessment',
      durationWeeks: 4,
      objectives: JSON.stringify(['User Research & Persona Development', 'Wireframing & Low-Fidelity Mockups', 'Component-Driven Design Systems in Figma', 'Interactive Micro-Animations & Prototyping']),
      projects: JSON.stringify(['Mobile Banking App Wireframe & Flow', 'E-Commerce Website High-Fidelity UI', 'Interactive Figma Prototype with Micro-Animations']),
      assignments: JSON.stringify(['Task 1: Banking App Wireframe', 'Task 2: E-Commerce Redesign', 'Task 3: Interactive Clickable Prototype']),
      requirements: JSON.stringify(['Free Figma account and passion for digital design']),
    },
    {
      slug: 'backend-cloud-internship',
      title: 'Backend & Cloud Engineering Virtual Internship',
      description: 'Hands-on backend engineering with Node.js/NestJS, PostgreSQL, Prisma ORM, Docker containers, Redis caching, and live cloud deployment.',
      priceInPaise: 149900,
      earlyBirdPriceInPaise: 49900,
      domain: 'backend',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 8,
      seatsRemaining: 12,
      totalSeats: 25,
      cohortStartsOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'INTERNSHIP',
      isFree: false,
      isPaidInternship: true,
      stipendDetails: 'Performance-based stipend up to ₹8,000 upon outstanding project evaluation',
      durationWeeks: 4,
      objectives: JSON.stringify(['Modular Backend Architecture with NestJS/Express', 'PostgreSQL Relational Data Modeling', 'Redis Caching & Rate-Limiting', 'Docker Containerization & Cloud Deployment']),
      projects: JSON.stringify(['Multi-tenant SaaS Billing Engine with Webhook Reconciliation', 'Distributed Task Queue with Redis Streams and Worker Threads']),
      assignments: JSON.stringify(['Task 1: REST API with Auth', 'Task 2: Redis Caching Layer', 'Task 3: Dockerized Cloud Deployment']),
      requirements: JSON.stringify(['Node.js / JavaScript / TypeScript fundamentals']),
    },
    {
      slug: 'full-stack-accelerator',
      title: 'Full-Stack Engineering Accelerator',
      description: 'A rigorous production-focused engineering cohort designed for BCA, MCA, and CS graduates. Master Next.js 15, NestJS, PostgreSQL indexing, Redis streams, and Razorpay idempotency.',
      priceInPaise: 199900,
      earlyBirdPriceInPaise: 59900,
      domain: 'fullstack',
      level: 'Intermediate to Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 14,
      seatsRemaining: 9,
      totalSeats: 40,
      cohortStartsOn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isPublished: true,
      type: 'COURSE',
      isFree: false,
      isPaidInternship: false,
      stipendDetails: '4 Production Capstone Repositories + SHA-256 Ledger',
      durationWeeks: 6,
      objectives: JSON.stringify(['Master Next.js 15 App Router & Server Components', 'Build scalable microservices with NestJS & PostgreSQL', 'Implement resilient distributed payment gateways with Razorpay', 'Deploy production cloud infra with Docker, Redis & CI/CD']),
      projects: JSON.stringify(['High-Throughput E-Commerce API with Double-Spend Protection', 'Real-time Collaborative Whiteboard with WebSockets', 'DevAscent Microservices Gateway with JWT Auth & Rate Limiting']),
      assignments: JSON.stringify(['Benchmark PostgreSQL indexing', 'Implement Redis Mutex in TypeScript', 'Design idempotent webhook consumer']),
      requirements: JSON.stringify(['Basic familiarity with JavaScript or TypeScript', 'Computer with at least 8GB RAM']),
    },
    {
      slug: 'react-foundations-free',
      title: 'Modern React & TypeScript Foundations',
      description: 'Zero-to-hero introductory course covering modern React 19, TypeScript fundamentals, responsive UI architecture, and REST API consumption. 100% Free with verifiable certificate.',
      priceInPaise: 69900,
      earlyBirdPriceInPaise: 19900,
      domain: 'frontend',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      cohortNumber: 1,
      seatsRemaining: 150,
      totalSeats: 200,
      cohortStartsOn: new Date(),
      isPublished: true,
      type: 'COURSE',
      isFree: false,
      isPaidInternship: false,
      stipendDetails: 'Verifiable Digital Certificate Included',
      durationWeeks: 4,
      objectives: JSON.stringify(['Understand JSX, Component Lifecycle, and modern React Hooks', 'Write strict type-safe code using TypeScript interfaces and generics', 'Build dynamic, responsive layouts using Tailwind CSS', 'Fetch and manage async state from REST APIs with TanStack Query']),
      projects: JSON.stringify(['Personal Portfolio & Interactive Resume Website', 'Real-time Crypto & Currency Converter Dashboard', 'GitHub User Search & Repository Analytics Web App']),
      assignments: JSON.stringify(['Refactor class components to custom functional hooks', 'Implement debounce search filter', 'Create responsive navbar with accessible mobile drawer']),
      requirements: JSON.stringify(['Basic HTML and CSS understanding']),
    },
  ];

  let freeReactCourse: any = null;

  for (const cData of coursesToCreate) {
    const course = await prisma.course.create({ data: cData });
    if (course.slug === 'react-foundations-free') {
      freeReactCourse = course;
    }
  }

  console.log(`Created ${coursesToCreate.length} Virtual Internships & Courses!`);

  // 4. Create Modules & Lessons for freeReactCourse
  if (freeReactCourse) {
    const freeMod1 = await prisma.module.create({
      data: {
        courseId: freeReactCourse.id,
        moduleNumber: 1,
        title: 'Module 1: React 19 Foundations & State Management',
        description: 'Understanding components, props, hooks, and clean state primitives.',
        lessons: {
          create: [
            {
              lessonNumber: 1,
              title: 'Modern React Architecture & Component Lifecycle',
              durationMinutes: 30,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              isFreePreview: true,
              summary: 'Understanding Virtual DOM reconciliation and declarative UI rendering.',
            },
            {
              lessonNumber: 2,
              title: 'Mastering Hooks: useState, useEffect, and Custom Hooks',
              durationMinutes: 45,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              isFreePreview: true,
              summary: 'Deep dive into hook rules, dependency arrays, and cleanup functions.',
            },
          ],
        },
      },
    });

    const freeMod2 = await prisma.module.create({
      data: {
        courseId: freeReactCourse.id,
        moduleNumber: 2,
        title: 'Module 2: TypeScript with React & Capstone Project',
        description: 'Typed props, event handling, and capstone project instructions.',
        lessons: {
          create: [
            {
              lessonNumber: 1,
              title: 'Type-Safe React: Props, Generics, and Event Handlers',
              durationMinutes: 40,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              isFreePreview: true,
              summary: 'Typing forms, HTML button props, and union dispatch states.',
            },
            {
              lessonNumber: 2,
              title: 'Capstone Project Walkthrough & Git Submission Guidelines',
              durationMinutes: 50,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              isFreePreview: true,
              summary: 'Guidelines for preparing your public GitHub repo and LinkedIn post for certification review.',
            },
          ],
        },
      },
    });

    // 5. Enroll Test Student
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: freeReactCourse.id,
        progressPct: 100,
        status: 'ACTIVE',
      },
    });

    const freeLessons = await prisma.lesson.findMany({
      where: { moduleId: { in: [freeMod1.id, freeMod2.id] } },
    });

    for (const l of freeLessons) {
      await prisma.lessonProgress.create({
        data: {
          userId: student.id,
          lessonId: l.id,
          watchedSeconds: l.durationMinutes * 60,
          isCompleted: true,
        },
      });
    }

    // 6. Create sample certificate for the Student
    const certId = 'DEV-2026-A1B2C3';
    const certRawPayload = `${certId}:${student.name}:${freeReactCourse.title}:DevAscent Academy:2026-03-01`;
    const sha256Hash = crypto.createHash('sha256').update(certRawPayload).digest('hex');

    await prisma.certificate.create({
      data: {
        certId,
        userId: student.id,
        courseId: freeReactCourse.id,
        recipientName: student.name,
        courseTitle: freeReactCourse.title,
        sha256Hash,
        grade: 'Distinction (A+)',
        issuedAt: new Date('2026-03-01T10:00:00Z'),
      },
    });
  }

  console.log(`Database seeded successfully with all CodSoft virtual internships & courses!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
