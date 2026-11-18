import json
import os
from typing import Dict, Any, List

from .preprocessor import ResumePreprocessor
from .tfidf_matcher import TfidfMatcher
from .category_scorer import CategoryScorer

class ATSEngine:
    """
    DevAscent Production ATS Scoring Engine.
    Combines TF-IDF vector similarity with calibrated 4-pillar category scoring,
    deep role comparison, missing points taxonomy, and prioritized correction points.
    """

    def __init__(self, data_dir: str = None):
        if not data_dir:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_dir = os.path.join(base_dir, "data")

        taxonomy_path = os.path.join(data_dir, "skills_taxonomy.json")
        with open(taxonomy_path, "r", encoding="utf-8") as f:
            self.taxonomy = json.load(f)

        jd_path = os.path.join(data_dir, "job_descriptions.json")
        with open(jd_path, "r", encoding="utf-8") as f:
            self.job_descriptions = json.load(f)

        self.preprocessor = ResumePreprocessor()
        self.tfidf_matcher = TfidfMatcher()
        self.category_scorer = CategoryScorer(self.taxonomy)

    def get_supported_roles(self) -> Dict[str, str]:
        return {k: v.get("title", k) for k, v in self.job_descriptions.items()}

    def score_resume(self, resume_text: str, target_role: str = "aiml") -> Dict[str, Any]:
        """
        Comprehensive scoring pipeline.
        Extracts metadata, performs TF-IDF vector matching, evaluates 4 pillars,
        compares against target role requirements, and delivers categorized correction points.
        """
        role_key = target_role.lower()
        if role_key not in self.job_descriptions:
            role_key = "aiml"

        job_config = self.job_descriptions[role_key]
        jd_text = job_config.get("description", "")

        # 1. Preprocess & Extract Metadata
        normalized_resume = self.preprocessor.normalize_text(resume_text)
        normalized_jd = self.preprocessor.normalize_text(jd_text)
        metadata = self.preprocessor.extract_metadata(resume_text)

        # 2. TF-IDF Cosine Similarity & Calibration
        raw_cosine = self.tfidf_matcher.compute_similarity(normalized_resume, normalized_jd)
        # Cosine similarity calibration: 0.28+ is an elite match in technical resumes
        calibrated_tfidf = min(100.0, round((raw_cosine / 0.28) * 100, 1))

        # 3. Category Scoring
        categories = self.category_scorer.evaluate(
            resume_text, normalized_resume, metadata, job_config
        )

        skills_score = categories["skills"]["score"]
        verbs_score = categories["verbs"]["score"]
        project_score = categories["project_evidence"]["score"]
        structure_score = categories["structure"]["score"]

        # Weighted Category Score
        cat_weighted = (
            skills_score * 0.40 +
            verbs_score * 0.20 +
            project_score * 0.25 +
            structure_score * 0.15
        )

        # Final Blended ATS Score: 70% Category evaluation + 30% Calibrated TF-IDF vector similarity
        final_score = round(cat_weighted * 0.70 + calibrated_tfidf * 0.30)
        final_score = max(0, min(100, final_score))

        # Letter Grade & Verdict
        if final_score >= 85:
            grade = "A+"
            grade_label = "Production Ready"
        elif final_score >= 75:
            grade = "A"
            grade_label = "Strong Match"
        elif final_score >= 60:
            grade = "B"
            grade_label = "Interview Competitive"
        elif final_score >= 45:
            grade = "C"
            grade_label = "Needs Optimization"
        else:
            grade = "D"
            grade_label = "Significant Gaps"

        # 4. Detailed Role Comparison Checklists
        found_req = categories["skills"]["found_required"]
        missing_req = categories["skills"]["missing_required"]
        found_rec = categories["skills"]["found_recommended"]
        missing_rec = categories["skills"]["missing_recommended"]

        required_checklist = [
            {"skill": s.upper(), "status": "matched" if s in found_req else "missing", "level": "Critical"}
            for s in job_config.get("required_skills", [])
        ]

        recommended_checklist = [
            {"skill": s.upper(), "status": "matched" if s in found_rec else "missing", "level": "Bonus"}
            for s in job_config.get("recommended_skills", [])
        ]

        matched_req_count = len(found_req)
        total_req_count = max(1, len(job_config.get("required_skills", [])))
        match_percentage = round((matched_req_count / total_req_count) * 100)

        # 5. Missing Points Identification
        missing_points: List[Dict[str, str]] = []
        if missing_req:
            missing_points.append({
                "type": "Critical Skill Gap",
                "title": f"Missing Core Requirements: {', '.join(s.upper() for s in missing_req)}",
                "description": f"The target role '{job_config.get('title')}' requires hands-on experience in {', '.join(missing_req)}. Adding these skills or related projects will significantly boost your ATS screening rate."
            })

        if missing_rec:
            missing_points.append({
                "type": "Recommended Skill Gap",
                "title": f"Missing Competitive Edge Skills: {', '.join(s.upper() for s in missing_rec[:3])}",
                "description": f"Candidates who showcase {', '.join(missing_rec[:3])} stand out in candidate shortlisting."
            })

        if categories["verbs"]["metrics_detected"] < 2:
            missing_points.append({
                "type": "Impact & Metric Gap",
                "title": "Low Quantifiable Impact Metrics",
                "description": "Recruiters and algorithmic screeners look for quantified outcomes (percentages, speedups, volume of data processed)."
            })

        if not metadata.get("has_github"):
            missing_points.append({
                "type": "Code Proof Gap",
                "title": "No Verified GitHub Profile Link",
                "description": "Engineering recruiters prioritize candidates with accessible code repositories and public commits."
            })

        if not metadata.get("has_portfolio") and "vercel" not in resume_text.lower() and "streamlit" not in resume_text.lower() and "render" not in resume_text.lower():
            missing_points.append({
                "type": "Deployment Gap",
                "title": "No Live Project Deployment Link",
                "description": "Including live deployment URLs (e.g. Vercel, Streamlit Cloud, Render) proves your applications work end-to-end."
            })

        # 6. Prioritized Correction Points (Actionable Fixes)
        correction_points: List[Dict[str, str]] = []

        if missing_req:
            correction_points.append({
                "category": "Skills Alignment",
                "action": f"Add {', '.join(f'`{s.upper()}`' for s in missing_req)} to your Technical Skills section and mention how you applied them in your project bullet points."
            })

        if categories["verbs"]["metrics_detected"] < 2:
            correction_points.append({
                "category": "Quantify Impact",
                "action": "Add specific numbers and percentages to your project descriptions (e.g. 'Achieved 94.2% classification accuracy', 'Processed 10,000+ records', 'Reduced API response time by 40%')."
            })

        if not metadata.get("other_urls") and "vercel" not in resume_text.lower() and "streamlit" not in resume_text.lower():
            correction_points.append({
                "category": "Live Demos",
                "action": "Add clickable live demo links next to your projects (e.g. [Live Streamlit App], [Vercel Demo]) so reviewers can test your work instantly."
            })

        if metadata.get("has_github") and not metadata.get("github_urls"):
            correction_points.append({
                "category": "URL Formatting",
                "action": "Ensure your GitHub link is written as a full URL (e.g. https://github.com/your-handle) rather than just the word 'GitHub', so ATS parsers index it properly."
            })

        if "docker" not in resume_text.lower() and "ci/cd" not in resume_text.lower():
            correction_points.append({
                "category": "DevOps Evidence",
                "action": "Mention containerization (Docker) or CI/CD pipelines (GitHub Actions) to demonstrate modern production software standards."
            })

        if len(categories["verbs"]["found"]) < 4:
            correction_points.append({
                "category": "Power Verbs",
                "action": "Start bullet points with strong action verbs like 'Architected', 'Deployed', 'Engineered', 'Optimized', and 'Classified' instead of passive phrases."
            })

        # 7. Executive Summary
        cand_name = metadata.get("candidate_name") or "Applicant"
        top_skills = [s.upper() for s in (found_req + found_rec)[:5]]
        skills_str = ", ".join(top_skills) if top_skills else "General technical skills"

        executive_summary = (
            f"{cand_name}'s resume demonstrates a {grade_label.lower()} profile with strong competency in {skills_str}. "
            f"The profile achieved an ATS match score of {final_score}/100 ({grade}) for the {job_config.get('title')} role. "
        )
        if missing_req:
            executive_summary += f"Key areas for immediate score improvement include integrating {', '.join(s.upper() for s in missing_req[:2])} and adding quantified project metrics."
        else:
            executive_summary += "Core requirements are met; adding live deployment URLs and production metrics will elevate this to an elite screening bracket."

        # ATS Parse Rate Calculation (Fidelity of document extraction & section hierarchy)
        parse_rate = 100
        parse_rate_reason = "All sections, headers, and content parsed with 100% readability."

        detected_sections = [s.lower() for s in metadata.get("detected_sections", [])]
        if not any(s in ["experience", "projects", "education", "internship", "skills"] for s in detected_sections) or len(detected_sections) < 2:
            parse_rate = 85
            parse_rate_reason = "Some standard ATS section headers (Experience, Projects, Education) could not be clearly identified."
        elif len(resume_text.strip()) < 150:
            parse_rate = 75
            parse_rate_reason = "Insufficient readable text extracted from document."

        parse_rate = max(50, min(100, parse_rate))
        parse_rate_missed = 100 - parse_rate

        return {
            "score": final_score,
            "grade": grade,
            "grade_label": grade_label,
            "executive_summary": executive_summary,
            "parse_rate": parse_rate,
            "parse_rate_missed": parse_rate_missed,
            "parse_rate_reason": parse_rate_reason,
            "target_role": {
                "key": role_key,
                "title": job_config.get("title", role_key),
                "description": jd_text,
            },
            "comparison": {
                "match_percentage": match_percentage,
                "matched_count": matched_req_count,
                "total_required": total_req_count,
                "required_checklist": required_checklist,
                "recommended_checklist": recommended_checklist,
            },
            "category_scores": {
                "technical_skills": skills_score,
                "action_verbs": verbs_score,
                "project_evidence": project_score,
                "structure_formatting": structure_score,
            },
            "missing_points": missing_points,
            "correction_points": correction_points,
            "metadata": {
                "candidate_name": metadata.get("candidate_name"),
                "email": metadata.get("email"),
                "phone": metadata.get("phone"),
                "detected_degree": metadata.get("detected_degree"),
                "detected_percentage": metadata.get("detected_percentage"),
                "has_github": metadata.get("has_github"),
                "has_linkedin": metadata.get("has_linkedin"),
                "has_portfolio": metadata.get("has_portfolio"),
                "word_count": metadata.get("word_count"),
                "sections_found": metadata.get("detected_sections"),
            },
            "skills_analysis": {
                "found_required": found_req,
                "missing_required": missing_req,
                "found_recommended": found_rec,
                "missing_recommended": missing_rec,
            },
            "action_verbs_found": categories["verbs"]["found"],
            "suggestions": [cp["action"] for cp in correction_points],
            "tfidf_similarity": calibrated_tfidf,
            "raw_cosine": round(raw_cosine, 4),
        }
