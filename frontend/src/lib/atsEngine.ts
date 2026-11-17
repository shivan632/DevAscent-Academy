// DevAscent ATS Engine - Pure TypeScript Implementation
// Mirrors python/model/ats_engine.py with 100% feature parity for Vercel Serverless execution.

export interface ATSResult {
  score: number;
  grade: string;
  grade_label: string;
  executive_summary: string;
  target_role: {
    key: string;
    title: string;
    description: string;
  };
  comparison: {
    match_percentage: number;
    matched_count: number;
    total_required: number;
    required_checklist: Array<{ skill: string; status: 'matched' | 'missing'; level: string }>;
    recommended_checklist: Array<{ skill: string; status: 'matched' | 'missing'; level: string }>;
  };
  category_scores: {
    technical_skills: number;
    action_verbs: number;
    project_evidence: number;
    structure_formatting: number;
  };
  missing_points: Array<{ type: string; title: string; description: string }>;
  correction_points: Array<{ category: string; action: string }>;
  suggestions: string[];
  metadata: {
    candidate_name: string;
    email: string | null;
    phone: string | null;
    detected_degree: string | null;
    detected_percentage: string | null;
    has_github: boolean;
    has_linkedin: boolean;
    has_portfolio: boolean;
    word_count: number;
    sections_found: string[];
  };
  skills_analysis: {
    found_required: string[];
    missing_required: string[];
    found_recommended: string[];
    missing_recommended: string[];
  };
  action_verbs_found: string[];
  tfidf_similarity: number;
  raw_cosine: number;
}

const JOB_DESCRIPTIONS: Record<string, any> = {
  aiml: {
    title: "AI & Machine Learning Engineer",
    description: "Seeking an AI/ML Engineer experienced in developing deep learning and machine learning systems using Python, TensorFlow, Keras, or PyTorch, and Scikit-learn. Must have hands-on experience in image recognition, CNN architectures, NLP, RAG pipelines, or medical/text analytics. Knowledge of REST APIs (FastAPI/Flask), Git version control, model deployment (Vercel, Render, or Streamlit), and data manipulation with Pandas and NumPy is essential.",
    required_skills: ["python", "machine learning", "deep learning", "tensorflow", "scikit-learn", "cnn", "git", "rest api"],
    recommended_skills: ["keras", "nlp", "rag", "fastapi", "pandas", "numpy", "data visualization", "docker", "streamlit", "sql"],
    min_action_verbs: 5
  },
  data_science: {
    title: "Data Scientist & Analytics Engineer",
    description: "Looking for a Data Scientist to build predictive analytics models, automated ETL data pipelines, and analytics dashboards. Must be proficient in Python, SQL, Pandas, NumPy, Scikit-learn, and data visualization tools like Seaborn or Plotly. Experience with OCR, text analytics, sentiment analysis, MySQL or PostgreSQL, and cloud services like Azure or AWS is highly desirable.",
    required_skills: ["python", "sql", "pandas", "numpy", "data visualization", "etl", "scikit-learn", "mysql"],
    recommended_skills: ["azure", "nlp", "fastapi", "deep learning", "ocr", "seaborn", "git", "rest api", "docker"],
    min_action_verbs: 5
  },
  python: {
    title: "Python & Backend Systems Engineer",
    description: "Seeking a Python Software Engineer to build scalable backend services, asynchronous APIs, and data processing systems. Required proficiency in Python 3, FastAPI or Django/Flask, relational databases like MySQL or PostgreSQL, REST API architecture, Git workflows, and database integration (SQLAlchemy or raw SQL). Experience with Docker, Redis caching, microservices, and automated testing is strongly preferred.",
    required_skills: ["python", "fastapi", "rest api", "sql", "git", "mysql"],
    recommended_skills: ["docker", "postgresql", "sqlalchemy", "redis", "pandas", "microservices", "unit testing", "linux"],
    min_action_verbs: 4
  },
  fullstack: {
    title: "Full-Stack AI & Cloud Engineer",
    description: "Looking for a Full-Stack Software Engineer proficient in React, Next.js, or JavaScript frontend paired with Python (FastAPI/Django) or Node.js backends. Must have hands-on experience building REST APIs, working with SQL or NoSQL databases (PostgreSQL, MySQL, Supabase, MongoDB), Git version control, responsive Tailwind CSS design, and deploying on cloud infrastructure (Vercel, Render, AWS, Docker).",
    required_skills: ["react", "python", "javascript", "rest api", "git", "sql", "tailwind"],
    recommended_skills: ["fastapi", "next.js", "supabase", "docker", "vercel", "mongodb", "postgresql", "ci/cd"],
    min_action_verbs: 4
  },
  frontend: {
    title: "Frontend React & Next.js Engineer",
    description: "Seeking a Frontend Engineer to architect responsive, high-performance web applications using React, Next.js, JavaScript/TypeScript, and Tailwind CSS. Experience with modern state management, component architecture, REST API integration, Git workflows, mobile-first responsive design, and performance optimization is essential.",
    required_skills: ["react", "javascript", "tailwind", "html", "css", "git", "rest api"],
    recommended_skills: ["next.js", "typescript", "redux", "zustand", "ui/ux", "responsive design", "performance optimization"],
    min_action_verbs: 4
  },
  backend: {
    title: "Backend Cloud & Microservices Engineer",
    description: "Looking for a Backend Engineer experienced in building resilient distributed services using Node.js/NestJS or Python/FastAPI. Strong understanding of relational databases (PostgreSQL/MySQL), database indexing, ORMs (Prisma, SQLAlchemy), REST API architecture, caching with Redis, Docker containerization, and Git workflows.",
    required_skills: ["rest api", "sql", "docker", "git", "postgresql", "python"],
    recommended_skills: ["fastapi", "nestjs", "redis", "sqlalchemy", "microservices", "jwt", "linux", "ci/cd"],
    min_action_verbs: 4
  }
};

const ACTION_VERBS = [
  "developed", "built", "implemented", "designed", "optimized", "trained", "deployed", "classified",
  "engineered", "architected", "automated", "integrated", "spearheaded", "processed", "scaled",
  "analyzed", "evaluated", "refactored", "orchestrated", "migrated", "maintained", "created"
];

const SKILL_ALIASES: Record<string, RegExp[]> = {
  "rest api": [/\brest\b/i, /\brestful\b/i, /\brest\s*apis?\b/i, /\bapi\s*development\b/i, /\bapis?\b/i],
  "next.js": [/\bnext\.?js\b/i, /\bnextjs\b/i, /\bnext\s*1[345]\b/i],
  "node.js": [/\bnode\.?js\b/i, /\bnodejs\b/i, /\bnode\b/i],
  "react": [/\breact\.?js\b/i, /\breactjs\b/i, /\breact\b/i],
  "postgresql": [/\bpostgresql\b/i, /\bpostgres\b/i, /\bpgsql\b/i],
  "ci/cd": [/\bci\/?cd\b/i, /\bcontinuous\s*integration\b/i, /\bgithub\s*actions\b/i],
  "docker": [/\bdocker\b/i, /\bdockerfile\b/i, /\bdocker\s*compose\b/i, /\bcontainerized?\b/i],
  "unit testing": [/\bunit\s*test(ing|s)?\b/i, /\bjest\b/i, /\bpytest\b/i, /\bmock\b/i],
  "tailwind": [/\btailwind\b/i, /\btailwindcss\b/i],
  "scikit-learn": [/\bscikit[-\s]?learn\b/i, /\bsklearn\b/i],
  "tensorflow": [/\btensorflow\b/i, /\btf\b/i, /\btensorflow\/keras\b/i],
  "deep learning": [/\bdeep\s*learning\b/i, /\bneural\s*networks?\b/i, /\bdl\b/i],
  "machine learning": [/\bmachine\s*learning\b/i, /\bai\/ml\b/i, /\bml\b/i],
  "cnn": [/\bcnns?\b/i, /\bconvolutional\s*neural\s*networks?\b/i],
  "nlp": [/\bnlp\b/i, /\bnatural\s*language\s*processing\b/i, /\btext\s*analytics\b/i],
  "rag": [/\brag\b/i, /\bretrieval\s*augmented\s*generation\b/i],
  "sql": [/\bsql\b/i, /\bmysql\b/i, /\bpostgresql\b/i, /\bsqlite\b/i, /\bsqlalchemy\b/i],
  "etl": [/\betl\b/i, /\betl\s*pipelines?\b/i, /\bdata\s*pipelines?\b/i],
  "data visualization": [/\bdata\s*visualization\b/i, /\bseaborn\b/i, /\bplotly\b/i, /\bmatplotlib\b/i, /\bdashboards?\b/i],
  "azure": [/\bazure\b/i, /\bmicrosoft\s*azure\b/i, /\bazure\s*document\s*intelligence\b/i],
  "ocr": [/\bocr\b/i, /\bocr\s*processing\b/i, /\bdocument\s*intelligence\b/i],
  "git": [/\bgit\b/i, /\bgithub\b/i, /\bversion\s*control\b/i],
  "fastapi": [/\bfastapi\b/i, /\bfast\s*api\b/i],
  "supabase": [/\bsupabase\b/i],
  "firebase": [/\bfirebase\b/i],
  "streamlit": [/\bstreamlit\b/i, /\bstreamlit\s*cloud\b/i],
};

function hasSkill(skill: string, text: string): boolean {
  const sk = skill.toLowerCase();
  if (SKILL_ALIASES[sk]) {
    return SKILL_ALIASES[sk].some((regex) => regex.test(text));
  }
  const reg = new RegExp(`\\b${sk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'i');
  return reg.test(text);
}

// Simple TF-IDF cosine similarity approximation
function computeTfidfCosine(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const words2 = text2.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  if (words1.length === 0 || words2.length === 0) return 0;

  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};
  for (const w of words1) freq1[w] = (freq1[w] || 0) + 1;
  for (const w of words2) freq2[w] = (freq2[w] || 0) + 1;

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const w in freq1) {
    norm1 += freq1[w] * freq1[w];
    if (freq2[w]) {
      dotProduct += freq1[w] * freq2[w];
    }
  }
  for (const w in freq2) {
    norm2 += freq2[w] * freq2[w];
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

export function evaluateResume(rawText: string, targetRoleKey = 'aiml'): ATSResult {
  const roleKey = JOB_DESCRIPTIONS[targetRoleKey.toLowerCase()] ? targetRoleKey.toLowerCase() : 'aiml';
  const jobConfig = JOB_DESCRIPTIONS[roleKey];
  const jdText = jobConfig.description;

  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  let candidateName = lines[0] || 'Candidate';
  if (candidateName.includes('@') || /\d/.test(candidateName)) {
    for (const l of lines.slice(0, 3)) {
      if (!l.includes('@') && !/\d/.test(l) && l.length < 40) {
        candidateName = l;
        break;
      }
    }
  }

  const emails = rawText.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g) || [];
  const phones = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/g) || [];

  const lowerRaw = rawText.toLowerCase();
  const hasGithub = /github\.com/i.test(rawText) || /github/i.test(rawText);
  const hasLinkedin = /linkedin\.com/i.test(rawText) || /linkedin/i.test(rawText);
  const hasPortfolio = /portfolio/i.test(rawText) || /streamlit/i.test(rawText) || /vercel/i.test(rawText) || /http/i.test(rawText);

  // Degree & Percentage
  const degreeMatch = lowerRaw.match(/\b(?:bca|b\.c\.a|btech|b\.tech|mca|m\.c\.a|mtech|m\.tech|b\.sc|m\.sc|bachelor[’']?s?|master[’']?s?)\b/i);
  const detectedDegree = degreeMatch ? degreeMatch[0].toUpperCase() : null;

  const percMatch = rawText.match(/(\d{1,2}(?:\.\d{1,2})?)\s*%/);
  const detectedPercentage = percMatch ? percMatch[0] : null;

  // Sections
  const sectionKeywords = ["summary", "professional summary", "academics", "education", "experience", "summer training", "internship", "projects", "skills", "certifications", "achievements", "area of interest"];
  const detectedSections: string[] = [];
  for (const s of sectionKeywords) {
    if (new RegExp(`\\b${s}\\b`, 'i').test(lowerRaw)) {
      detectedSections.push(s.charAt(0).toUpperCase() + s.slice(1));
    }
  }

  // 1. Technical Skills
  const reqSkills: string[] = jobConfig.required_skills;
  const recSkills: string[] = jobConfig.recommended_skills;

  const foundReq = reqSkills.filter((s) => hasSkill(s, rawText));
  const missingReq = reqSkills.filter((s) => !hasSkill(s, rawText));
  const foundRec = recSkills.filter((s) => hasSkill(s, rawText));
  const missingRec = recSkills.filter((s) => !hasSkill(s, rawText));

  const reqRatio = foundReq.length / Math.max(1, reqSkills.length);
  const recRatio = foundRec.length / Math.max(1, recSkills.length);
  const skillsScore = Math.min(100, Math.round((reqRatio * 75 + recRatio * 25) * 10) / 10);

  // 2. Action Verbs & Metrics
  const foundVerbs: string[] = [];
  for (const v of ACTION_VERBS) {
    if (new RegExp(`\\b${v}(?:ed|ing|s)?\\b`, 'i').test(lowerRaw)) {
      foundVerbs.push(v.charAt(0).toUpperCase() + v.slice(1));
    }
  }
  const minVerbs = jobConfig.min_action_verbs || 4;
  const verbBase = Math.min(85, Math.round((foundVerbs.length / minVerbs) * 80 * 10) / 10);
  const metricsMatches = rawText.match(/\b\d+(?:[.,]\d+)?(?:\+|%|x|ms|k|m)?\b/gi) || [];
  const metricsFound = metricsMatches.filter((m) => !/^202\d$/.test(m) && m.length > 1);
  const verbScore = Math.min(100, Math.round((verbBase + Math.min(20, metricsFound.length * 5)) * 10) / 10);

  // 3. Project Evidence
  let projectPoints = 0;
  if (hasGithub) projectPoints += 35;
  if (hasPortfolio || /vercel/i.test(rawText) || /render/i.test(rawText) || /streamlit/i.test(rawText)) projectPoints += 25;
  if (/docker/i.test(rawText) || /ci\/cd/i.test(rawText) || /git/i.test(rawText) || /pipeline/i.test(rawText)) projectPoints += 20;
  if (/api/i.test(rawText) || /fastapi/i.test(rawText) || /rest/i.test(rawText) || /model/i.test(rawText) || /cnn/i.test(rawText)) projectPoints += 20;
  const projectScore = Math.min(100, projectPoints);

  // 4. Structure
  let structPoints = 0;
  structPoints += Math.min(40, detectedSections.length * 8);
  if (emails.length > 0) structPoints += 20;
  if (phones.length > 0) structPoints += 15;
  if (hasLinkedin) structPoints += 15;
  if (hasGithub) structPoints += 10;
  const wordCount = rawText.trim().split(/\s+/).length;
  if (wordCount >= 180 && wordCount <= 1100) structPoints += 10;
  else structPoints += 5;
  const structureScore = Math.min(100, structPoints);

  // Blended TF-IDF
  const rawCosine = computeTfidfCosine(rawText, jdText);
  const calibratedTfidf = Math.min(100, Math.round((rawCosine / 0.28) * 100 * 10) / 10);

  const catWeighted = skillsScore * 0.40 + verbScore * 0.20 + projectScore * 0.25 + structureScore * 0.15;
  const finalScore = Math.max(0, Math.min(100, Math.round(catWeighted * 0.70 + calibratedTfidf * 0.30)));

  let grade = "D";
  let gradeLabel = "Significant Gaps";
  if (finalScore >= 85) {
    grade = "A+";
    gradeLabel = "Production Ready";
  } else if (finalScore >= 75) {
    grade = "A";
    gradeLabel = "Strong Match";
  } else if (finalScore >= 60) {
    grade = "B";
    gradeLabel = "Interview Competitive";
  } else if (finalScore >= 45) {
    grade = "C";
    gradeLabel = "Needs Optimization";
  }

  // Checklists
  const reqChecklist = reqSkills.map((s) => ({
    skill: s.toUpperCase(),
    status: (foundReq.includes(s) ? 'matched' : 'missing') as 'matched' | 'missing',
    level: 'Critical',
  }));
  const recChecklist = recSkills.map((s) => ({
    skill: s.toUpperCase(),
    status: (foundRec.includes(s) ? 'matched' : 'missing') as 'matched' | 'missing',
    level: 'Bonus',
  }));

  // Gaps & Missing points
  const missingPoints = [];
  if (missingReq.length > 0) {
    missingPoints.push({
      type: "Critical Skill Gap",
      title: `Missing Core Requirements: ${missingReq.map((s) => s.toUpperCase()).join(', ')}`,
      description: `The target role '${jobConfig.title}' expects hands-on experience in ${missingReq.join(', ')}. Adding projects mentioning these will boost your score.`
    });
  }
  if (missingRec.length > 0) {
    missingPoints.push({
      type: "Recommended Skill Gap",
      title: `Missing Competitive Edge: ${missingRec.slice(0, 3).map((s) => s.toUpperCase()).join(', ')}`,
      description: `Candidates showcasing ${missingRec.slice(0, 3).join(', ')} stand out in recruiter screening.`
    });
  }
  if (metricsFound.length < 2) {
    missingPoints.push({
      type: "Impact & Metric Gap",
      title: "Low Quantifiable Impact Metrics",
      description: "Recruiters and automated screeners look for quantified outcomes (percentages, speedups, records processed)."
    });
  }
  if (!hasGithub) {
    missingPoints.push({
      type: "Code Proof Gap",
      title: "No Verified GitHub Profile Link",
      description: "Technical recruiters prioritize candidates with accessible code repositories and public commits."
    });
  }
  if (!hasPortfolio && !/vercel/i.test(rawText) && !/streamlit/i.test(rawText)) {
    missingPoints.push({
      type: "Deployment Gap",
      title: "No Live Project Deployment Link",
      description: "Live deployment URLs (e.g. Vercel, Streamlit Cloud, Render) prove your applications work in production."
    });
  }

  // Corrections
  const correctionPoints = [];
  if (missingReq.length > 0) {
    correctionPoints.push({
      category: "Skills Alignment",
      action: `Add ${missingReq.map((s) => `\`${s.toUpperCase()}\``).join(', ')} to your Technical Skills section and mention how you used them in your project bullets.`
    });
  }
  if (metricsFound.length < 2) {
    correctionPoints.push({
      category: "Quantify Impact",
      action: "Add specific numbers and percentages to your project descriptions (e.g. 'Achieved 94.2% accuracy', 'Processed 10,000+ records', 'Reduced latency by 40%')."
    });
  }
  if (!hasPortfolio && !/vercel/i.test(rawText) && !/streamlit/i.test(rawText)) {
    correctionPoints.push({
      category: "Live Demos",
      action: "Add clickable live demo links next to your projects (e.g. [Live Streamlit App], [Vercel Demo]) so reviewers can test your work instantly."
    });
  }
  if (hasGithub && !/https?:\/\//i.test(rawText)) {
    correctionPoints.push({
      category: "URL Formatting",
      action: "Ensure your GitHub link is written as a full URL (e.g. https://github.com/your-handle) rather than just the word 'GitHub', so ATS parsers index it properly."
    });
  }
  if (!/docker/i.test(rawText) && !/ci\/cd/i.test(rawText)) {
    correctionPoints.push({
      category: "DevOps Evidence",
      action: "Mention containerization (Docker) or CI/CD pipelines (GitHub Actions) to demonstrate modern production software standards."
    });
  }
  if (foundVerbs.length < 4) {
    correctionPoints.push({
      category: "Power Verbs",
      action: "Start bullet points with strong action verbs like 'Architected', 'Deployed', 'Engineered', 'Optimized', and 'Classified' instead of passive phrases."
    });
  }

  // Executive summary
  const topSkills = [...foundReq, ...foundRec].slice(0, 5).map((s) => s.toUpperCase());
  const skillsStr = topSkills.length > 0 ? topSkills.join(', ') : "general technical skills";
  let executiveSummary = `${candidateName}'s resume demonstrates a ${gradeLabel.toLowerCase()} profile with strong competency in ${skillsStr}. The profile achieved an ATS match score of ${finalScore}/100 (${grade}) for the ${jobConfig.title} role. `;
  if (missingReq.length > 0) {
    executiveSummary += `Key areas for immediate score improvement include integrating ${missingReq.slice(0, 2).map((s) => s.toUpperCase()).join(', ')} and adding quantified project metrics.`;
  } else {
    executiveSummary += `Core requirements are met; adding live deployment URLs and production metrics will elevate this to an elite screening bracket.`;
  }

  return {
    score: finalScore,
    grade,
    grade_label: gradeLabel,
    executive_summary: executiveSummary,
    target_role: {
      key: roleKey,
      title: jobConfig.title,
      description: jdText,
    },
    comparison: {
      match_percentage: Math.round((foundReq.length / Math.max(1, reqSkills.length)) * 100),
      matched_count: foundReq.length,
      total_required: reqSkills.length,
      required_checklist: reqChecklist,
      recommended_checklist: recChecklist,
    },
    category_scores: {
      technical_skills: skillsScore,
      action_verbs: verbScore,
      project_evidence: projectScore,
      structure_formatting: structureScore,
    },
    missing_points: missingPoints,
    correction_points: correctionPoints,
    suggestions: correctionPoints.map((cp) => cp.action),
    metadata: {
      candidate_name: candidateName.slice(0, 50),
      email: emails[0] || null,
      phone: phones[0] || null,
      detected_degree: detectedDegree,
      detected_percentage: detectedPercentage,
      has_github: hasGithub,
      has_linkedin: hasLinkedin,
      has_portfolio: hasPortfolio,
      word_count: wordCount,
      sections_found: Array.from(new Set(detectedSections)),
    },
    skills_analysis: {
      found_required: foundReq,
      missing_required: missingReq,
      found_recommended: foundRec,
      missing_recommended: missingRec,
    },
    action_verbs_found: foundVerbs,
    tfidf_similarity: calibratedTfidf,
    raw_cosine: Math.round(rawCosine * 10000) / 10000,
  };
}
