from model.ats_engine import ATSEngine

def run_tests():
    engine = ATSEngine()
    print("=" * 60)
    print("DevAscent Self-Built ATS Model Test Suite")
    print("Supported Roles:", list(engine.get_supported_roles().keys()))
    print("=" * 60)

    # 1. Strong Full-Stack Resume
    strong_fullstack = """
    Shivan Mishra | shivan@devascent.me | +91 9876543210
    GitHub: https://github.com/shivan632 | LinkedIn: https://linkedin.com/in/shivan-mishra
    Portfolio: https://devascentacademy.me/@raja2012

    SKILLS:
    Languages: TypeScript, JavaScript, Python, SQL, HTML, CSS
    Frameworks: Next.js, React, Node.js, NestJS, Tailwind CSS, Express
    Databases: PostgreSQL, Prisma ORM, Redis, MongoDB
    Cloud & DevOps: Docker, Git, GitHub Actions, CI/CD, AWS, Vercel, Render

    EXPERIENCE:
    Full-Stack Software Engineer Intern | DevAscent Academy
    - Architected and deployed a multi-tenant learning workspace serving 1,200+ students.
    - Built idempotent payment gateway webhooks using Razorpay SDK and HMAC-SHA256 signature verification.
    - Optimized database queries using Prisma indexing on PostgreSQL, cutting response latency by 45%.
    - Integrated Redis in-memory caching to eliminate redundant database reads for high-traffic endpoints.

    PROJECTS:
    DevAscent Academy LMS & Certification Hub
    - Engineered cryptographically tamper-proof SHA-256 certificate generation pipeline in NestJS and PDFKit.
    - Deployed containerized backend using Docker Compose and Vercel edge runtime for frontend.
    - Code: https://github.com/shivan632/devascent-academy
    """

    # 2. Strong Python Resume
    strong_python = """
    Raja Singh | raja@devascent.me | +91 9123456780
    GitHub: https://github.com/raja2012 | LinkedIn: https://linkedin.com/in/raja2012

    TECHNICAL SKILLS:
    Python 3, FastAPI, Django, PostgreSQL, SQL, Docker, Git, Redis, Pandas, NumPy, REST API, Linux

    WORK EXPERIENCE & PROJECTS:
    Backend Python Engineer
    - Developed high-throughput REST APIs using FastAPI and Pydantic validation models.
    - Built background worker queues using Celery and Redis to process asynchronous tasks.
    - Deployed Docker containers to Render with automated GitHub Actions CI/CD workflows.
    - Optimized PostgreSQL queries and database migrations with SQLAlchemy, improving throughput by 30%.
    - Code: https://github.com/raja2012/fastapi-microservice
    """

    # 3. Minimal / Weak Resume
    weak_resume = """
    John Doe
    Email: john@test.com
    Objective: Looking for a software job.
    Skills: HTML, CSS, C
    Interests: Coding, Gaming, Traveling
    Education: B.Tech Computer Science 2026
    """

    test_cases = [
        ("Strong Full-Stack Resume (Tested vs Full-Stack Role)", strong_fullstack, "fullstack"),
        ("Strong Python Resume (Tested vs Python Role)", strong_python, "python"),
        ("Weak Resume with Missing Tech & Verbs (Tested vs Full-Stack Role)", weak_resume, "fullstack"),
    ]

    for title, resume_text, role in test_cases:
        print(f"\n--- {title} ---")
        result = engine.score_resume(resume_text, target_role=role)
        print(f"Overall ATS Score: {result['score']}/100 (Grade: {result['grade']} - {result['grade_label']})")
        print(f"TF-IDF Similarity: {result['tfidf_similarity']}%")
        print("Category Scores:", result["category_scores"])
        print("Found Required Skills:", result["skills_analysis"]["found_required"])
        print("Missing Required Skills:", result["skills_analysis"]["missing_required"])
        print("Action Verbs Found:", result["action_verbs_found"])
        print("Actionable Suggestions:")
        for idx, s in enumerate(result["suggestions"], 1):
            print(f"  {idx}. {s}")

if __name__ == "__main__":
    run_tests()
