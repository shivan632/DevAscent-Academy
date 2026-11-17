from typing import Dict, List, Tuple, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class TfidfMatcher:
    """
    Computes vector space relevance and TF-IDF cosine similarity between
    the student's resume and target engineering job descriptions.
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words="english",
            max_features=500,
            sublinear_tf=True
        )

    def compute_similarity(self, resume_normalized: str, jd_normalized: str) -> float:
        """
        Returns cosine similarity score between 0.0 and 1.0 (converted to percentage).
        """
        if not resume_normalized or not jd_normalized:
            return 0.0

        try:
            tfidf_matrix = self.vectorizer.fit_transform([jd_normalized, resume_normalized])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            # Clip between 0.0 and 1.0
            return max(0.0, min(1.0, float(similarity)))
        except Exception:
            return 0.0

    def extract_top_terms(self, text_normalized: str, top_n: int = 20) -> List[Tuple[str, float]]:
        """
        Extracts the highest-weighted TF-IDF terms from the text.
        """
        if not text_normalized:
            return []

        try:
            vec = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
            matrix = vec.fit_transform([text_normalized])
            feature_names = vec.get_feature_names_out()
            scores = matrix.toarray()[0]
            term_scores = [(feature_names[i], float(scores[i])) for i in range(len(scores)) if scores[i] > 0]
            term_scores.sort(key=lambda x: x[1], reverse=True)
            return term_scores[:top_n]
        except Exception:
            return []
