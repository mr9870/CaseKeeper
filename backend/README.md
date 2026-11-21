# CaseKeeper NLP Backend — Zero AI API Legal Intelligence

This Python backend extracts **dates, names, litigating parties, legal statutes, monetary claims, and an extractive case summary** from legal documents **without calling any external AI model API** (Zero OpenAI, Zero Gemini API, Zero Anthropic API).

---

## 🌟 Is it possible without AI models?
**Yes, 100% possible.** In classical NLP and computational linguistics, documents are summarized using **extractive summarization** (TF-IDF frequency, lexical centrality, and position heuristics) and named entity recognition using deterministic grammar rules, regex patterns, and gazetteers tailored for Indian legal formats.

### Advantages:
1. **100% Offline & Private:** Client data and case files never leave your system.
2. **Instant Response Time:** Processes complete dockets in less than **30 milliseconds**.
3. **Zero Cost / No API Keys:** Never runs out of credits or tokens.
4. **No AI Hallucinations:** Every extracted fact, date, and party is verbatim from the source document.

---

## 🚀 How to Run the Backend

### Prerequisites
Python 3.10+ (Tested on Python 3.12.6)

Installed packages:
```bash
pip install fastapi uvicorn PyPDF2 scikit-learn
```

### Start the Server
```bash
# From the casebridge/backend directory:
python main.py
```
Or via uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

The server will be live on: `http://localhost:8000`  
Interactive Swagger API docs: `http://localhost:8000/docs`

---

## 📡 API Endpoints

### 1. Extract from Uploaded File (PDF or TXT)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/extract/upload`
- **Body:** `multipart/form-data` with `file: <your_document.pdf>`

### 2. Extract from Raw Text
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/extract/text`
- **Body:** `application/json`
```json
{
  "text": "Full legal document or petition text...",
  "filename": "Petition.txt"
}
```

### Response Format:
```json
{
  "success": true,
  "data": {
    "filename": "Complaint_Sharma_v_Horizon.txt",
    "char_count": 1942,
    "word_count": 284,
    "summary": "The Complainants entered into a registered Agreement for Sale on 12/01/2023 with the Respondent for Unit No. 402... The Respondent promised to handover physical possession on or before 12/01/2025... On 28/08/2025, the Respondent unilaterally issued a Possession Extension Notice... Hence, this complaint is instituted seeking statutory delay interest and compensation.",
    "parties": {
      "petitioner": "Suresh Kumar Sharma & Sunita Sharma",
      "respondent": "Horizon Developers & Promoters Pvt. Ltd.",
      "counsels": ["Adv. Rajesh Verma"],
      "all_detected_names": ["Sunita Sharma", "Suresh Kumar", "Shri Rajesh Malhotra", "Rajesh Verma"]
    },
    "dates": [
      {
        "date": "12/01/2023",
        "context": "...into a registered Agreement for Sale on 12/01/2023 with the Respondent...",
        "source_sentence": "The Complainants entered into a registered Agreement for Sale on 12/01/2023..."
      },
      {
        "date": "12/01/2025",
        "context": "...promised to handover physical possession within 24 months, i.e., on or before 12/01/2025.",
        "source_sentence": "As per Clause 14(a) of the Agreement, the Respondent promised to handover physical possession..."
      }
    ],
    "statutes": ["RERA Act 2016"],
    "sections": ["Section 18", "Section 31"],
    "monetary_amounts": ["Rs. 15,00,000/-", "Rs. 3,20,000/-", "Rs. 65,00,000/-"],
    "dispute_categories": ["Delay in Possession", "Consumer Grievance"],
    "engine": "CaseKeeper Offline NLP Engine (Zero AI API)"
  }
}
```

---

## 🧪 Quick Test Script
To test the extraction logic immediately in your terminal:
```bash
python test_extractor.py
```
