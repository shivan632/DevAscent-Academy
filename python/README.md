# DevAscent Self-Built ATS Model & Scoring Engine 🚀

A production-ready, deterministic self-built ATS scoring engine designed for DevAscent Academy. It combines scikit-learn TF-IDF vector space modeling with a 4-pillar industrial engineering evaluation pipeline.

---

## 🏗️ Architecture & Scoring Formula

```
Candidate Resume (Text / Upload)
       │
       ▼
┌─────────────────────────────────┐
│ 1. Preprocessing & Normalizer   │ ── Extracts GitHub, LinkedIn, emails, URLs, sections
└─────────────────────────────────┘
       │
       ├───► [TF-IDF Matcher (30% weight)]
       │     • N-gram (1,2) Vectorizer vs DevAscent Benchmark JDs
       │     • Calibrated Cosine Similarity Score (0 - 100%)
       │
       └───► [Category Scorer (70% weight)]
             • Technical Skills Match (40%): Required vs Recommended skills
             • Action Verbs & Impact  (20%): Quantified engineering metrics
             • Production Evidence    (25%): GitHub repo links, live Vercel/Render demos
             • Structure & Layout     (15%): Sections, word count, contact details
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ Final Score (0 - 100) + Grade (A+, A, B, C, D) + Action Tips│
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### 1. Run the Test Suite:
```bash
python test_engine.py
```

### 2. Start the FastAPI Production Service:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API Swagger documentation is available at: `http://localhost:8000/docs`.

---

## 📡 API Endpoints

### `POST /score`
**Payload:**
```json
{
  "resume_text": "Experienced Full-Stack Engineer proficient in Next.js, TypeScript...",
  "target_role": "fullstack"
}
```

### `POST /upload`
Multipart form upload accepting `.txt`, `.docx`, or raw text with target role parameter.

### `GET /roles`
Returns benchmark roles supported (`fullstack`, `python`, `backend`, `frontend`).
