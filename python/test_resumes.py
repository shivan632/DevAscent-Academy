import json
from model.ats_engine import ATSEngine

engine = ATSEngine()

prakhar_resume = """
PRAKHAR SRIVASTAVA
prakharsrivastava019@gmail.com    +91-9792486222    Prayagraj, India
LinkedIn    Portfolio   Github
PROFESSIONAL SUMMARY
Highly motivated and detail-oriented Python developer with a strong foundation in AI, Machine Learning, and Deep Learning. Currently learning React and FastAPI and eager to apply my skills to build intelligent, end-to-end solutions. A quick learner with strong problem-solving abilities, ready to contribute in an entry-level role.
ACADEMICS
Bachelor’s in Computer Applications, United University (2023-2026)
Intermediate , Sanskaar International School, Prayagraj 2023
High School, Sankaar International School , Prayagraj 2021
SUMMER TRAINING
AI/ML Intern, Labmentix [June-2025 – August-2025]
Developed end-to-end machine learning models using Python (Scikit-learn, TensorFlow), employing Git for version control.
Student Intern, Acmegrade [April-2024 – June-2024]
Developed responsive web applications using HTML5, CSS3, JavaScript, ensuring cross-browser compatibility and mobile-first design.
PROJECTS
Developer Mart
Developer-Mart is a beginner-friendly platform designed to assist newcomers in coding and programming. It provides live in-browser coding, simple tutorials, and curated learning resources.
CraftSathi
CraftSathi is an online platform connecting skilled artisans with customers seeking bespoke craftwork. It features a user-friendly frontend and a robust backend, enabling artisans to showcase their work and customers to place custom orders.
Brain-Tumour-Prediction
Developed an AI-based Brain Tumor Prediction system using Deep Learning and CNN models to classify MRI scan images with high accuracy. Implemented image preprocessing, model training, and prediction workflows using Python and TensorFlow/Keras.
SKILLS
Advance knowledge – Python, FastAPI, REST APIs, Scikit-learn
Basic Knowledge – Java, Javascript, GenAI , React
Front-end – HTML, CSS 
Database – MongoDB, MySQL 
Tools – Visual Studio Code, Git, Github, Firebase
CERTIFICATIONS
Certified in Artificial Intelligence and Machine Learning (Labmentix)
Certified in Web Development (Acmegrade)
AI for Beginners Certification (HP Life) 
Area Of Intrest
Designing the user interface for websites
Solving leetcode to sharpen my logic. Currently completed 209 questions
"""

shivan_resume = """
SHIVAN MISHRA
shivrom.2020@gmail.com +91-9935806722 LinkedIn, Portfolio, GitHub
PROFESSIONAL SUMMARY
AI/ML enthusiast with hands-on experience in Machine Learning, NLP, predictive analytics, and Full-Stack Development. Skilled in Python, Deep Learning, and data-driven application development, with a strong focus on building scalable AI-powered solutions and analytical systems.
EXPERIENCE
Data Scientist Intern - Clinch Soft Bridge Jan 2026 – Feb 2026
● Developed an AI-driven judicial analytics platform using Python, Azure Document Intelligence, NLP, and MySQL to process and analyze High Court hearing transcripts.
● Built automated ETL pipelines for OCR-based document ingestion, schema-driven legal entity extraction, data validation, and structured storage in MySQL.
● Implemented sentiment analysis on legal statements and proceedings to identify sentiment trends and critical observations from case hearings.
● Designed interactive dashboards and reporting modules for daily, weekly, and monthly analytics including gender-wise case trends, location-based analysis, pending cases, and case resolution metrics.
● Optimized large-scale transcript processing workflows using REST APIs, text analytics, and automated reporting pipelines.
AI/ML Intern — Labmentix Jun 2025 – Aug 2025
● Developed a Deep Learning-based fish species classification system using CNNs with TensorFlow/Keras for image recognition and feature extraction. Applied image preprocessing and augmentation techniques to improve model accuracy and performance.
PROJECTS
FlashNotes – AI-Powered Learning & Productivity Platform (GitHub, Project, Streamlit)
● Developed a full-stack AI-powered learning platform using React.js, FastAPI, Supabase, and Streamlit with features like AI Notes Generation, QA Generator, Roadmap Generator, PDF Summarizer, and RAG implementation using OpenRouter and Gemini APIs with fallback mechanisms.
● Implemented Speech-to-Text voice notes via Web Speech API, real-time analytics dashboards using Pandas & Plotly, gamification features (leaderboard, certificates, points system), and deployed across Vercel, Render, Streamlit Cloud, and Electron desktop app.
QuickDocAI- AI-Powered Healthcare Platform (GitHub, Project)
● Developed a full-stack AI-based medical documentation system designed to simplify healthcare workflows through intelligent document generation, summarization, and management.
● Smart AI Document Processing – Integrated advanced AI capabilities for automatic medical document summarization, report generation, and intelligent text processing.
● Full-Stack Architecture & API Integration – Designed and implemented backend services with secure API handling, authentication systems.
● Cloud Deployment & Scalability – Successfully deployed the application on Vercel with optimized frontend performance and scalable cloud infrastructure.
Brain Tumor MRI Classifier (GitHub)
● Developed a medical imaging classification system using Deep Learning (CNN) in Python to automatically detect and classify brain tumors from MRI scans.
● Built and trained a Convolutional Neural Network (CNN) model with TensorFlow/Keras to learn discriminative features from MRI images.
ACADEMICS: -
● Bachelor of Computer Applications (BCA) United University, Prayagraj | (87.1%) 2023-2026
SKILLS
Python | JavaScript | SQL | React.js | FastAPI | TensorFlow | Keras | Scikit-learn | Pandas | NumPy | Seaborn | SQLAlchemy | MySQL | Supabase | Firebase | Microsoft Azure Document Intelligence | Git | OCR Processing | ETL Pipelines | NLP | Data Visualization | API Development | TailwindCSS
CERTIFICATES
Certified in Python | Certified in Machine Learning | Certified in Artificial Intelligence | Certified in Data Science | Certified in Data Visualisation
"""

print("==================================================")
print("TEST 1: PRAKHAR SRIVASTAVA RESUME (Role: aiml)")
print("==================================================")
res1 = engine.score_resume(prakhar_resume, target_role="aiml")
print(f"Candidate: {res1['metadata']['candidate_name']}")
print(f"Score: {res1['score']}/100 | Grade: {res1['grade']} ({res1['grade_label']})")
print(f"Category Scores: {res1['category_scores']}")
print(f"Matched Required Skills: {res1['skills_analysis']['found_required']}")
print(f"Missing Required Skills: {res1['skills_analysis']['missing_required']}")
print(f"Executive Summary: {res1['executive_summary']}")
print("Missing Points:", len(res1['missing_points']))
for mp in res1['missing_points']:
    print(f"  - [{mp['type']}] {mp['title']}")
print("Correction Points:", len(res1['correction_points']))
for cp in res1['correction_points']:
    print(f"  - [{cp['category']}] {cp['action']}")

print("\n==================================================")
print("TEST 2: SHIVAN MISHRA RESUME (Role: aiml)")
print("==================================================")
res2 = engine.score_resume(shivan_resume, target_role="aiml")
print(f"Candidate: {res2['metadata']['candidate_name']}")
print(f"Score: {res2['score']}/100 | Grade: {res2['grade']} ({res2['grade_label']})")
print(f"Category Scores: {res2['category_scores']}")
print(f"Matched Required Skills: {res2['skills_analysis']['found_required']}")
print(f"Missing Required Skills: {res2['skills_analysis']['missing_required']}")
print(f"Executive Summary: {res2['executive_summary']}")
print("Correction Points:")
for cp in res2['correction_points']:
    print(f"  - [{cp['category']}] {cp['action']}")

print("\n==================================================")
print("TEST 3: SHIVAN MISHRA RESUME (Role: data_science)")
print("==================================================")
res3 = engine.score_resume(shivan_resume, target_role="data_science")
print(f"Score: {res3['score']}/100 | Grade: {res3['grade']} ({res3['grade_label']})")
print(f"Matched Required: {res3['skills_analysis']['found_required']}")
print(f"Missing Required: {res3['skills_analysis']['missing_required']}")
