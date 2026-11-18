from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import io
import uvicorn

from model.ats_engine import ATSEngine

app = FastAPI(
    title="DevAscent ATS Scoring Engine",
    description="Production-grade self-built ATS scoring model with PDF/DOCX parsing, role comparison, and correction points.",
    version="2.0.0"
)

# Enable CORS for frontend and external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ATSEngine()

class ScoreRequest(BaseModel):
    resume_text: str = Field(..., min_length=20, description="Full raw or extracted text of candidate resume")
    target_role: Optional[str] = Field("aiml", description="Target role key (aiml, data_science, python, fullstack, frontend, backend)")

def extract_text_from_file(content_bytes: bytes, filename: str) -> str:
    """
    Extracts text cleanly from PDF, DOCX, or TXT files.
    """
    fname = filename.lower()
    text = ""

    if fname.endswith(".pdf"):
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            pages_text = []
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    pages_text.append(extracted)
            text = "\n\n".join(pages_text)
        except Exception as e:
            text = ""

        # Sanitize binary artifacts / control codes
        import re
        text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", " ", text)

    elif fname.endswith(".docx"):
        try:
            import docx
            doc = docx.Document(io.BytesIO(content_bytes))
            parts = []
            for p in doc.paragraphs:
                if p.text.strip():
                    parts.append(p.text.strip())
            for table in doc.tables:
                for row in table.rows:
                    row_content = " | ".join(c.text.strip() for c in row.cells if c.text.strip())
                    if row_content:
                        parts.append(row_content)
            text = "\n".join(parts)
        except Exception as e:
            text = content_bytes.decode("utf-8", errors="ignore")

    elif fname.endswith(".txt"):
        try:
            text = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            text = content_bytes.decode("latin-1", errors="ignore")
    else:
        # Generic fallback
        try:
            text = content_bytes.decode("utf-8")
        except Exception:
            text = content_bytes.decode("latin-1", errors="ignore")

    return text.strip()

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "DevAscent ATS Scoring Engine v2",
        "supported_roles": engine.get_supported_roles(),
    }

@app.get("/roles")
def get_roles():
    return engine.get_supported_roles()

@app.post("/score")
def score_resume_endpoint(payload: ScoreRequest):
    try:
        result = engine.score_resume(
            resume_text=payload.resume_text,
            target_role=payload.target_role or "aiml"
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS scoring failed: {str(e)}")

@app.post("/upload")
async def upload_resume_endpoint(
    file: UploadFile = File(...),
    target_role: str = Form("aiml")
):
    try:
        content_bytes = await file.read()
        extracted_text = extract_text_from_file(content_bytes, file.filename)

        if len(extracted_text) < 20:
            raise HTTPException(
                status_code=400,
                detail="Could not extract sufficient text from the uploaded document. Please check the file formatting."
            )

        result = engine.score_resume(
            resume_text=extracted_text,
            target_role=target_role
        )
        return {
            "success": True,
            "filename": file.filename,
            "extracted_text_preview": extracted_text[:300] + ("..." if len(extracted_text) > 300 else ""),
            "data": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document parsing failed: {str(e)}")

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
