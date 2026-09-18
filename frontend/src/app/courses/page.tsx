'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';
import {
  Code2,
  Server,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Briefcase,
  Award,
  Terminal,
  Cpu,
  Smartphone,
  Database,
  Bot,
  Palette,
  Check
} from 'lucide-react';

export const ALL_COURSES_CATALOG = [
  {
    id: 'web-dev-internship',
    slug: 'web-development-internship',
    title: 'Web Development Virtual Internship',
    domain: 'web',
    level: 'Beginner to Intermediate',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 29900,
    priceInPaise: 99900,
    description: 'Hands-on web development internship covering HTML5, CSS3, JavaScript ES6+, React, DOM manipulation, responsive layouts, and Git version control. Complete 3 milestone projects with verified certification.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 12,
    badge: 'Trending #1',
    tasks: ['Landing Page Architecture', 'Personal Portfolio with Interactive Theme', 'Calculator / Dynamic Web App'],
    icon: Code2,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'python-internship',
    slug: 'python-programming-internship',
    title: 'Python Programming Virtual Internship',
    domain: 'python',
    level: 'Beginner to Intermediate',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 19900,
    priceInPaise: 79900,
    description: 'Master Python fundamentals, data structures, automation scripts, Tkinter desktop GUIs, and web scrapers. Build 3 production utilities and earn a tamper-proof credential.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 15,
    badge: 'Popular',
    tasks: ['To-Do List GUI Application', 'Password Generator & Strength Meter', 'Rock-Paper-Scissors / Contact Book'],
    icon: Terminal,
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'java-internship',
    slug: 'java-programming-internship',
    title: 'Java Programming Virtual Internship',
    domain: 'java',
    level: 'Beginner to Intermediate',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 24900,
    priceInPaise: 89900,
    description: 'Object-Oriented Programming (OOP), Collections framework, exception handling, Swing desktop GUIs, and JDBC database connectivity. Build 3 enterprise-grade Java applications.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 11,
    badge: 'Enterprise Core',
    tasks: ['Number Guessing Game with Scoring', 'Student Grade Calculator & Registry', 'ATM Interface with Account Operations'],
    icon: Cpu,
    color: 'from-orange-600 to-red-600',
  },
  {
    id: 'cpp-internship',
    slug: 'cpp-programming-internship',
    title: 'C++ Programming Virtual Internship',
    domain: 'cpp',
    level: 'Beginner to Intermediate',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 19900,
    priceInPaise: 69900,
    description: 'Deep dive into C++ syntax, pointers, memory allocation, Object-Oriented Design, and Standard Template Library (STL) algorithms. Complete 3 algorithmic system challenges.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 9,
    badge: 'Core Systems',
    tasks: ['Number Guessing Game', 'Simple Arithmetic & Scientific Calculator', 'Tic-Tac-Toe Game with AI / 2-Player'],
    icon: Terminal,
    color: 'from-blue-700 to-cyan-700',
  },
  {
    id: 'android-internship',
    slug: 'android-app-development-internship',
    title: 'Android App Development Virtual Internship',
    domain: 'android',
    level: 'Intermediate',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 39900,
    priceInPaise: 129900,
    description: 'Develop native Android apps using Android Studio, Kotlin/Java, XML/Jetpack Compose, Room SQLite, and REST API consumption with Retrofit.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 7,
    badge: 'Mobile App',
    tasks: ['Unit Converter / Quiz App', 'Quote of the Day App with REST API', 'Personal Expense Tracker / Task Manager'],
    icon: Smartphone,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'data-science-internship',
    slug: 'data-science-internship',
    title: 'Data Science & Analytics Virtual Internship',
    domain: 'data',
    level: 'Intermediate',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 49900,
    priceInPaise: 149900,
    description: 'End-to-end data analytics workflow using Python, Pandas, NumPy, Matplotlib, Seaborn, exploratory data analysis (EDA), and machine learning regression algorithms.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 10,
    badge: 'High Demand',
    tasks: ['Titanic Survival Prediction (Classification)', 'Movie Rating Prediction with Regression', 'Iris Flower Classification / Sales Prediction'],
    icon: Database,
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'machine-learning-internship',
    slug: 'machine-learning-internship',
    title: 'Machine Learning Virtual Internship',
    domain: 'ai',
    level: 'Intermediate to Advanced',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 59900,
    priceInPaise: 179900,
    description: 'Train, evaluate, and fine-tune predictive models with Scikit-Learn, Random Forests, Decision Trees, Supervised Learning, and Kaggle competitive datasets.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 8,
    badge: 'AI Track',
    tasks: ['Credit Card Fraud Detection', 'Spam SMS Classifier with NLP', 'Customer Churn Prediction Engine'],
    icon: Bot,
    color: 'from-pink-600 to-purple-600',
  },
  {
    id: 'ai-internship',
    slug: 'artificial-intelligence-internship',
    title: 'Artificial Intelligence Virtual Internship',
    domain: 'ai',
    level: 'Intermediate to Advanced',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 59900,
    priceInPaise: 199900,
    description: 'Build intelligent systems with Natural Language Processing (NLP), rule-based chatbots, Computer Vision with OpenCV, and OpenAI API workflows.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 6,
    badge: 'Generative AI',
    tasks: ['Rule-Based AI Chatbot', 'Tic-Tac-Toe AI with Minimax Algorithm', 'Face Detection / Image Classifier'],
    icon: Bot,
    color: 'from-violet-600 to-indigo-700',
  },
  {
    id: 'ui-ux-internship',
    slug: 'ui-ux-design-internship',
    title: 'UI/UX Design Virtual Internship',
    domain: 'design',
    level: 'Beginner to Intermediate',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 29900,
    priceInPaise: 99900,
    description: 'Master UI/UX workflow with Figma, wireframing, component-driven design systems, user personas, UX heuristics, and clickable interactive prototypes.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 9,
    badge: 'Design Track',
    tasks: ['Mobile Banking App Wireframe & Flow', 'E-Commerce Website High-Fidelity UI', 'Interactive Figma Prototype with Micro-Animations'],
    icon: Palette,
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'backend-cloud-internship',
    slug: 'backend-cloud-internship',
    title: 'Backend & Cloud Engineering Virtual Internship',
    domain: 'backend',
    level: 'Intermediate',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 49900,
    priceInPaise: 149900,
    description: 'Hands-on backend engineering with Node.js/NestJS, PostgreSQL, Prisma ORM, Docker containers, Redis caching, and live cloud deployment.',
    type: 'INTERNSHIP',
    isFree: false,
    isPaidInternship: true,
    stipendDetails: 'Verified Certificate + LOR + Task Assessment',
    cohortNumber: 8,
    badge: 'Cloud & API',
    tasks: ['RESTful API with JWT Auth & RBAC', 'Database Caching with Redis & Postgres', 'Dockerized Microservices on Cloud'],
    icon: Server,
    color: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'full-stack-accelerator',
    slug: 'full-stack-accelerator',
    title: 'Full-Stack Engineering Accelerator',
    domain: 'fullstack',
    level: 'Intermediate to Advanced',
    durationWeeks: 6,
    earlyBirdPriceInPaise: 59900,
    priceInPaise: 199900,
    description: 'Master Next.js 15, NestJS, PostgreSQL indexing, Redis streams, and Razorpay payment webhooks with 4 production capstone projects.',
    type: 'COURSE',
    isFree: false,
    isPaidInternship: false,
    stipendDetails: '4 Production Capstone Repositories + SHA-256 Ledger',
    cohortNumber: 14,
    badge: 'Flagship Cohort',
    tasks: ['Multi-Tenant SaaS App', 'NestJS Microservices Backend', 'Razorpay Fintech Engine', 'SHA-256 Verifier Ledger'],
    icon: Layers,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'react-foundations-free',
    slug: 'react-foundations-free',
    title: 'Modern React & TypeScript Foundations',
    domain: 'web',
    level: 'Beginner',
    durationWeeks: 4,
    earlyBirdPriceInPaise: 19900,
    priceInPaise: 69900,
    description: 'Zero-to-hero introductory course covering modern React 19, TypeScript fundamentals, responsive UI architecture, and REST API consumption.',
    type: 'COURSE',
    isFree: false,
    isPaidInternship: false,
    stipendDetails: 'Verifiable Digital Certificate Included',
    cohortNumber: 1,
    badge: 'Starter Track',
    tasks: ['Personal Portfolio Website', 'Crypto Dashboard with REST API', 'Interactive GitHub Explorer'],
    icon: Code2,
    color: 'from-emerald-600 to-teal-600',
  },
];

export default function CourseDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [courses, setCourses] = useState<any[]>(ALL_COURSES_CATALOG);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await api.getCourses();
        if (res?.courses && res.courses.length > 0) {
          // Merge database courses with full catalog
          const dbSlugs = new Set(res.courses.map((c: any) => c.slug));
          const combined = [
            ...res.courses,
            ...ALL_COURSES_CATALOG.filter((c) => !dbSlugs.has(c.slug)),
          ];
          setCourses(combined);
        }
      } catch (e) {
        // Fallback to full catalog
      }
    }
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'internship') return c.type === 'INTERNSHIP';
    if (selectedCategory === 'course') return c.type === 'COURSE';
    return c.domain === selectedCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>4-Week Task-Based Virtual Internships & Engineering Tracks</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Virtual Internships & Engineering Programs
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Real project milestones, task evaluations, GitHub PR submissions, Letter of Recommendation (LOR), and cryptographically verifiable certificates for only <span className="font-bold text-indigo-600 dark:text-indigo-400">₹199 – ₹599</span>.
            </p>
          </div>

          {/* Pricing Guarantee Strip */}
          <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-indigo-900/10 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-900 dark:text-white">Batch #04 Registrations Open</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified SHA-256 Certificates</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>LOR on Task Completion</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹199 - ₹599 All-Inclusive
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'internship', label: '💼 Virtual Internships' },
              { id: 'web', label: '🌐 Web Development' },
              { id: 'python', label: '🐍 Python' },
              { id: 'java', label: '☕ Java' },
              { id: 'cpp', label: '⚡ C++' },
              { id: 'android', label: '📱 Android' },
              { id: 'data', label: '📊 Data Science' },
              { id: 'ai', label: '🤖 AI & ML' },
              { id: 'design', label: '🎨 UI/UX Design' },
              { id: 'backend', label: '☁️ Backend & Cloud' },
              { id: 'fullstack', label: '🚀 Full-Stack' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Courses / Internships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredCourses.map((course) => {
              const isInternship = course.type === 'INTERNSHIP';
              const price = `₹${((course.earlyBirdPriceInPaise || 19900) / 100).toLocaleString()}`;
              const origPrice = `₹${((course.priceInPaise || 79900) / 100).toLocaleString()}`;
              const IconComp = course.icon || Briefcase;

              return (
                <div
                  key={course.id || course.slug}
                  className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 group"
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                          {course.badge || (isInternship ? 'Virtual Internship' : 'Cohort')}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {course.durationWeeks || 4} Weeks
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Milestone Tasks Preview */}
                    {course.tasks && course.tasks.length > 0 && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                          3 Milestone Tasks:
                        </span>
                        {course.tasks.map((task: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{task}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.level || 'Beginner to Intermediate'}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <Award className="w-3.5 h-3.5" />
                        <span>Verifiable Certificate</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-6 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{price}</span>
                        <span className="text-xs text-slate-400 line-through">{origPrice}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                        One-Time Fee • No Hidden Costs
                      </span>
                    </div>

                    <Link
                      href={`/checkout?course=${course.slug}&price=${course.earlyBirdPriceInPaise / 100}`}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>Enroll ({price})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Trust Section */}
          <div className="mt-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Why DevAscent Virtual Internships?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every internship candidate builds 3 practical projects, submits GitHub pull requests, receives code review benchmarks, and is awarded a tamper-proof SHA-256 certificate verifiable by recruiters worldwide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Self-Paced 4-Week Schedule</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Permanent Public Registry ID</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Letter of Recommendation (LOR)</span>
              </span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
