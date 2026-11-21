"""
CaseKeeper Python Backend — Zero AI Model Dependency
===================================================
FastAPI service exposing algorithmic legal document summarization,
date extraction, party/name extraction, and statute identification.

Run locally:
    python main.py
Or with uvicorn:
    uvicorn main:app --reload --port 8000
"""

import os
import sys
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from extractor import (
    analyze_legal_document, 
    extract_text_from_pdf_bytes,
    clean_text
)

app = FastAPI(
    title="CaseKeeper Document Extraction Backend",
    description="Zero-AI-API Algorithmic Legal Intelligence Engine (Extractive Summarization & Named Entity Extraction)",
    version="1.0.0"
)

# Enable CORS for Next.js frontend (local and deployed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://casekeeper.antideploy.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextAnalysisRequest(BaseModel):
    text: str
    filename: Optional[str] = "Case_Pleading.txt"
    max_sentences: Optional[int] = 4


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CaseKeeper Legal NLP Backend",
        "ai_dependency": "None (Pure Algorithmic NLP & TF-IDF)",
        "endpoints": {
            "health": "/api/health",
            "extract_text": "POST /api/extract/text",
            "upload_file": "POST /api/extract/upload"
        }
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ai_api_required": False,
        "engine": "CaseKeeper Offline NLP Engine",
        "supported_formats": [".pdf", ".txt", "raw_text"]
    }


@app.post("/api/extract/text")
def extract_from_text(payload: TextAnalysisRequest):
    """
    Extracts summary, dates, parties, statutes and amounts from raw text
    without any third-party AI model API.
    """
    if not payload.text or len(payload.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text payload must contain at least 10 characters.")

    result = analyze_legal_document(payload.text, filename=payload.filename)
    return {
        "success": True,
        "data": result
    }


@app.post("/api/extract/upload")
async def extract_from_file(file: UploadFile = File(...)):
    """
    Upload a PDF or TXT file to extract summary, important dates, names, and topics.
    Zero AI tokens, runs locally in milliseconds.
    """
    filename = file.filename or "uploaded_document"
    contents = await file.read()
    
    extracted_text = ""
    if filename.lower().endswith('.pdf'):
        extracted_text = extract_text_from_pdf_bytes(contents)
        if not extracted_text:
            raise HTTPException(
                status_code=422, 
                detail="Could not extract readable text from PDF. It may be an image-only scan or password-protected."
            )
    else:
        try:
            extracted_text = contents.decode('utf-8')
        except UnicodeDecodeError:
            extracted_text = contents.decode('latin-1', errors='ignore')

    if len(extracted_text.strip()) < 10:
        raise HTTPException(
            status_code=400, 
            detail="The uploaded file does not contain sufficient text for legal extraction."
        )

    result = analyze_legal_document(extracted_text, filename=filename)
    return {
        "success": True,
        "data": result
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting CaseKeeper NLP Engine on http://localhost:{port} (Zero AI API mode)")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
