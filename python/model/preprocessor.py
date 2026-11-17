import re
from typing import Dict, List, Set, Any, Optional

class ResumePreprocessor:
    """
    Cleans, normalizes, and extracts structured metadata from raw resume text.
    Handles academic degrees, links (GitHub/LinkedIn/Portfolio/LeetCode), contact info,
    metrics, and preserves technical tokens.
    """

    STOPWORDS: Set[str] = {
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
        "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
        "to", "was", "were", "will", "with", "i", "my", "we", "our", "you",
        "this", "which", "have", "been", "had", "would", "about", "into"
    }

    URL_GITHUB_PATTERN = re.compile(r"(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_\-]+", re.IGNORECASE)
    URL_LINKEDIN_PATTERN = re.compile(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_\-]+", re.IGNORECASE)
    URL_GENERIC_PATTERN = re.compile(r"https?://[^\s<>\"']+|www\.[^\s<>\"']+", re.IGNORECASE)
    EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
    PHONE_PATTERN = re.compile(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}")

    DEGREE_PATTERNS = [
        r"\b(?:bca|b\.c\.a|btech|b\.tech|mca|m\.c\.a|mtech|m\.tech|b\.sc|m\.sc|bachelor[’']?s?|master[’']?s?)\b",
    ]

    def normalize_text(self, text: str) -> str:
        """
        Normalizes text into a clean lowercase string while safeguarding technical abbreviations.
        """
        if not text:
            return ""

        t = text.lower()
        t = re.sub(r"\bnext\.js\b", "nextjs", t)
        t = re.sub(r"\bnode\.js\b", "nodejs", t)
        t = re.sub(r"\breact\.js\b", "reactjs", t)
        t = re.sub(r"\bvue\.js\b", "vuejs", t)
        t = re.sub(r"\bexpress\.js\b", "expressjs", t)
        t = re.sub(r"\bc\+\+\b", "cplusplus", t)
        t = re.sub(r"\bc#\b", "csharp", t)
        t = re.sub(r"\bci/cd\b", "cicd", t)
        t = re.sub(r"\bscikit-learn\b", "scikitlearn", t)
        t = re.sub(r"\bazure document intelligence\b", "azuredocumentintelligence", t)

        t = re.sub(r"[-_/]", " ", t)
        t = re.sub(r"[^a-z0-9\s]", " ", t)
        tokens = t.split()
        return " ".join(tokens)

    def extract_metadata(self, raw_text: str) -> Dict[str, Any]:
        """
        Extracts candidate contact info, portfolio/github indicators, degrees, and section structure.
        """
        if not raw_text:
            return {
                "candidate_name": "Applicant",
                "has_email": False,
                "has_phone": False,
                "has_github": False,
                "has_linkedin": False,
                "has_portfolio": False,
                "github_urls": [],
                "linkedin_urls": [],
                "other_urls": [],
                "detected_sections": [],
                "detected_degree": None,
                "detected_percentage": None,
                "word_count": 0,
            }

        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        candidate_name = lines[0] if lines else "Candidate"
        # If line 0 contains an email or phone, look for a cleaner name token
        if "@" in candidate_name or any(c.isdigit() for c in candidate_name):
            for l in lines[:3]:
                if "@" not in l and not any(c.isdigit() for c in l) and len(l) < 40:
                    candidate_name = l
                    break

        github_urls = self.URL_GITHUB_PATTERN.findall(raw_text)
        linkedin_urls = self.URL_LINKEDIN_PATTERN.findall(raw_text)
        all_urls = self.URL_GENERIC_PATTERN.findall(raw_text)
        other_urls = [u for u in all_urls if "github.com" not in u.lower() and "linkedin.com" not in u.lower()]

        # Check for textual mention of profiles (common when PDFs strip hyperlinks into plain labels)
        lower_raw = raw_text.lower()
        has_github = len(github_urls) > 0 or "github" in lower_raw
        has_linkedin = len(linkedin_urls) > 0 or "linkedin" in lower_raw
        has_portfolio = len(other_urls) > 0 or "portfolio" in lower_raw or "streamlit" in lower_raw or "vercel" in lower_raw

        emails = self.EMAIL_PATTERN.findall(raw_text)
        phones = self.PHONE_PATTERN.findall(raw_text)

        # Detect degree
        detected_degree = None
        for pat in self.DEGREE_PATTERNS:
            match = re.search(pat, lower_raw)
            if match:
                detected_degree = match.group(0).upper()
                break

        # Detect GPA or percentage (e.g. 87.1%, 8.5 CGPA)
        perc_match = re.search(r"(\d{1,2}(?:\.\d{1,2})?)\s*%", raw_text)
        detected_percentage = perc_match.group(0) if perc_match else None

        # Check for standard resume sections
        section_keywords = [
            "summary", "professional summary", "academics", "education",
            "experience", "summer training", "internship", "projects",
            "skills", "certifications", "achievements", "area of interest"
        ]
        detected_sections = []
        for sec in section_keywords:
            if re.search(r"\b" + re.escape(sec) + r"\b", lower_raw):
                detected_sections.append(sec.title())

        words = raw_text.split()

        return {
            "candidate_name": candidate_name[:50],
            "email": emails[0] if emails else None,
            "phone": phones[0] if phones else None,
            "has_email": len(emails) > 0,
            "has_phone": len(phones) > 0,
            "has_github": has_github,
            "has_linkedin": has_linkedin,
            "has_portfolio": has_portfolio,
            "github_urls": github_urls,
            "linkedin_urls": linkedin_urls,
            "other_urls": other_urls,
            "detected_sections": list(dict.fromkeys(detected_sections)),
            "detected_degree": detected_degree,
            "detected_percentage": detected_percentage,
            "word_count": len(words),
        }
