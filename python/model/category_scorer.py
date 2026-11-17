import re
from typing import Dict, List, Any

class CategoryScorer:
    """
    Evaluates resumes across 4 industrial engineering pillars:
    1. Core Technical Skills (40%)
    2. Action Verbs & Impact (20%)
    3. Project & Production Evidence (25%)
    4. Structure & Formatting (15%)
    """

    ALIASES = {
        "rest api": [r"\brest\b", r"\brestful\b", r"\brest\s*apis?\b", r"\bapi\s*development\b", r"\bapis?\b"],
        "next.js": [r"\bnext\.?js\b", r"\bnextjs\b", r"\bnext\s*1[345]\b"],
        "node.js": [r"\bnode\.?js\b", r"\bnodejs\b", r"\bnode\b"],
        "react": [r"\breact\.?js\b", r"\breactjs\b", r"\breact\b"],
        "postgresql": [r"\bpostgresql\b", r"\bpostgres\b", r"\bpgsql\b"],
        "ci/cd": [r"\bci/?cd\b", r"\bcontinuous\s*integration\b", r"\bgithub\s*actions\b"],
        "docker": [r"\bdocker\b", r"\bdockerfile\b", r"\bdocker\s*compose\b", r"\bcontainerized?\b"],
        "unit testing": [r"\bunit\s*test(ing|s)?\b", r"\bjest\b", r"\bpytest\b", r"\bmock\b"],
        "tailwind": [r"\btailwind\b", r"\btailwindcss\b"],
        "c++": [r"\bc\+\+\b", r"\bcpp\b"],
        "c#": [r"\bc#\b", r"\bcsharp\b"],
        "scikit-learn": [r"\bscikit[-\s]?learn\b", r"\bsklearn\b"],
        "tensorflow": [r"\btensorflow\b", r"\btf\b", r"\btensorflow/keras\b"],
        "deep learning": [r"\bdeep\s*learning\b", r"\bneural\s*networks?\b", r"\bdl\b"],
        "machine learning": [r"\bmachine\s*learning\b", r"\bai/ml\b", r"\bml\b"],
        "cnn": [r"\bcnns?\b", r"\bconvolutional\s*neural\s*networks?\b"],
        "nlp": [r"\bnlp\b", r"\bnatural\s*language\s*processing\b", r"\btext\s*analytics\b"],
        "rag": [r"\brag\b", r"\bretrieval\s*augmented\s*generation\b"],
        "sql": [r"\bsql\b", r"\bmysql\b", r"\bpostgresql\b", r"\bsqlite\b", r"\bsqlalchemy\b"],
        "etl": [r"\betl\b", r"\betl\s*pipelines?\b", r"\bdata\s*pipelines?\b"],
        "data visualization": [r"\bdata\s*visualization\b", r"\bseaborn\b", r"\bplotly\b", r"\bmatplotlib\b", r"\bdashboards?\b"],
        "azure": [r"\bazure\b", r"\bmicrosoft\s*azure\b", r"\bazure\s*document\s*intelligence\b"],
        "ocr": [r"\bocr\b", r"\bocr\s*processing\b", r"\bdocument\s*intelligence\b"],
        "git": [r"\bgit\b", r"\bgithub\b", r"\bversion\s*control\b"],
        "fastapi": [r"\bfastapi\b", r"\bfast\s*api\b"],
        "supabase": [r"\bsupabase\b"],
        "firebase": [r"\bfirebase\b"],
        "streamlit": [r"\bstreamlit\b", r"\bstreamlit\s*cloud\b"],
    }

    def __init__(self, taxonomy: Dict[str, Any]):
        self.categories = taxonomy.get("categories", {})
        self.action_verbs = set(self.categories.get("action_verbs", []))

    def _has_skill(self, skill: str, text: str) -> bool:
        skill_lower = skill.lower()
        if skill_lower in self.ALIASES:
            for pattern in self.ALIASES[skill_lower]:
                if re.search(pattern, text, re.IGNORECASE):
                    return True
            return False

        pattern = r"\b" + re.escape(skill_lower) + r"s?\b"
        return bool(re.search(pattern, text, re.IGNORECASE))

    def evaluate(
        self,
        raw_text: str,
        normalized_text: str,
        metadata: Dict[str, Any],
        job_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        lower_raw = raw_text.lower()
        required_skills = job_config.get("required_skills", [])
        recommended_skills = job_config.get("recommended_skills", [])

        # 1. Technical Skills Score (40% weight)
        found_required = []
        missing_required = []
        for skill in required_skills:
            if self._has_skill(skill, lower_raw) or self._has_skill(skill, normalized_text):
                found_required.append(skill)
            else:
                missing_required.append(skill)

        found_recommended = []
        missing_recommended = []
        for skill in recommended_skills:
            if self._has_skill(skill, lower_raw) or self._has_skill(skill, normalized_text):
                found_recommended.append(skill)
            else:
                missing_recommended.append(skill)

        req_ratio = len(found_required) / max(1, len(required_skills))
        rec_ratio = len(found_recommended) / max(1, len(recommended_skills))
        skills_score = round(min(100.0, (req_ratio * 75 + rec_ratio * 25)), 1)

        # 2. Action Verbs & Impact (20% weight)
        found_verbs = []
        for verb in self.action_verbs:
            pattern = r"\b" + re.escape(verb) + r"(?:ed|ing|s)?\b"
            if re.search(pattern, lower_raw, re.IGNORECASE):
                found_verbs.append(verb.capitalize())

        min_verbs = job_config.get("min_action_verbs", 4)
        verb_base_score = min(85.0, round((len(found_verbs) / max(1, min_verbs)) * 80, 1))

        # Check for quantifiable metrics (e.g. 87.1%, 209 questions, 35%, 1200+, 2x, 500ms)
        metrics_matches = re.findall(r"\b\d+(?:[.,]\d+)?(?:\+|%|x|ms|k|m)?\b", raw_text, re.IGNORECASE)
        metrics_found = [m for m in metrics_matches if not re.match(r"^202\d$", m) and len(m) > 1]
        
        metrics_bonus = min(20.0, len(metrics_found) * 5.0)
        verb_score = min(100.0, round(verb_base_score + metrics_bonus, 1))

        # 3. Project & Production Evidence (25% weight)
        project_points = 0
        project_details = []

        if metadata.get("has_github"):
            project_points += 35
            project_details.append("GitHub profile/repository linked (+35)")
        
        has_live_deployment = (
            metadata.get("has_portfolio") or
            "vercel" in lower_raw or "render" in lower_raw or "streamlit" in lower_raw or
            "aws" in lower_raw or "firebase" in lower_raw or "supabase" in lower_raw
        )
        if has_live_deployment:
            project_points += 25
            project_details.append("Live cloud deployment / hosting detected (+25)")

        if "docker" in lower_raw or "ci/cd" in lower_raw or "git" in lower_raw or "pipeline" in lower_raw:
            project_points += 20
            project_details.append("DevOps/Pipeline engineering evidence (+20)")

        if "api" in lower_raw or "fastapi" in lower_raw or "rest" in lower_raw or "model" in lower_raw or "cnn" in lower_raw:
            project_points += 20
            project_details.append("Production API / Architecture integration (+20)")

        project_score = min(100.0, float(project_points))

        # 4. Structure & Readability (15% weight)
        struct_points = 0
        struct_details = []

        sections = metadata.get("detected_sections", [])
        struct_points += min(40, len(sections) * 8)
        struct_details.append(f"{len(sections)} standard resume sections found")

        if metadata.get("has_email"):
            struct_points += 20
        if metadata.get("has_phone"):
            struct_points += 15
        if metadata.get("has_linkedin"):
            struct_points += 15
        if metadata.get("has_github"):
            struct_points += 10

        wc = metadata.get("word_count", 0)
        if 180 <= wc <= 1100:
            struct_points += 10
            struct_details.append("Optimal word count for 1-2 page ATS parse")
        elif wc > 1100:
            struct_points += 5
            struct_details.append("Slightly long (>1100 words)")
        else:
            struct_points += 5
            struct_details.append("Brief resume length (<180 words)")

        structure_score = min(100.0, float(struct_points))

        return {
            "skills": {
                "score": skills_score,
                "found_required": found_required,
                "missing_required": missing_required,
                "found_recommended": found_recommended,
                "missing_recommended": missing_recommended,
            },
            "verbs": {
                "score": verb_score,
                "found": found_verbs,
                "metrics_detected": len(metrics_found),
                "metrics_samples": metrics_found[:4],
            },
            "project_evidence": {
                "score": project_score,
                "details": project_details,
            },
            "structure": {
                "score": structure_score,
                "detected_sections": sections,
                "details": struct_details,
            },
        }
