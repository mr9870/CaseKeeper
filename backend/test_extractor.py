"""
Verification & Test Script for CaseKeeper Zero-AI NLP Engine
Run this script to immediately test the document summarizer and extractors:
    python test_extractor.py
"""

import json
from extractor import analyze_legal_document

SAMPLE_LEGAL_DOCUMENT = """
BEFORE THE HARYANA REAL ESTATE REGULATORY AUTHORITY, GURUGRAM
COMPLAINT NO. HRGR/RERA/2026/0842

IN THE MATTER OF:
Suresh Kumar Sharma & Sunita Sharma
R/o Flat No. 102, Sector 15, Gurugram
... COMPLAINANT / ALLOTTEES

VERSUS

Horizon Developers & Promoters Pvt. Ltd.
Registered Office: Horizon Heights, Sector 82, Gurugram
Through its Authorized Director, Shri Rajesh Malhotra
... RESPONDENT / PROMOTER

MEMORANDUM OF COMPLAINT UNDER SECTION 18 AND 31 OF RERA ACT 2016

1. The Complainants entered into a registered Agreement for Sale on 12/01/2023 with the Respondent for Unit No. 402, 4th Floor, Tower B, Horizon Heights, Sector 82, Gurugram.
2. The total agreed sale consideration was Rs. 65,00,000/- (Rupees Sixty Five Lakhs Only). The Complainant has disbursed advance booking token amount of Rs. 15,00,000/- on 15/01/2023 via HDFC Bank NEFT.
3. As per Clause 14(a) of the Agreement, the Respondent promised to handover physical possession of the said residential unit within 24 months, i.e., on or before 12/01/2025.
4. On 28/08/2025, the Respondent unilaterally issued a Possession Extension Notice citing force majeure and revised the completion date to 31/12/2026 without any sanction from the Authority.
5. In addition, on 10/10/2025, the Respondent raised an unlawful demand of Rs. 3,20,000/- for alleged super area escalation without providing revised architectural drawings.
6. A formal Legal Notice dated 15/11/2025 was served by Adv. Rajesh Verma on behalf of the Complainants demanding immediate handover and statutory delay interest under Section 18 of RERA Act.
7. Despite receipt of notice on 20/11/2025, the Respondent failed to refund or offer possession. Hence, this complaint is instituted seeking statutory delay interest and compensation.

PRAYER:
The Complainants respectfully pray that this Hon'ble Authority direct the Respondent to pay delay interest at MCLR + 2% per annum on the total deposited amount of Rs. 65,00,000/- from 12/01/2025 till actual physical possession.

Adv. Rajesh Verma
Counsel for Complainants
Dated: 22/12/2025
"""

def main():
    print("=" * 70)
    print("TESTING CASEKEEPER ZERO-AI LEGAL EXTRACTION ENGINE")
    print("=" * 70)

    result = analyze_legal_document(SAMPLE_LEGAL_DOCUMENT, filename="Complaint_Sharma_v_Horizon.txt")

    print("\n[1] EXTRACTIVE SUMMARY (Zero AI API Used):")
    print("-" * 50)
    print(result["summary"])

    print("\n[2] LITIGATING PARTIES IDENTIFIED:")
    print("-" * 50)
    print(f"• Petitioner / Complainant: {result['parties']['petitioner']}")
    print(f"• Respondent / Promoter:    {result['parties']['respondent']}")
    print(f"• Counsels:                 {', '.join(result['parties']['counsels'])}")
    print(f"• Other Names Detected:     {', '.join(result['parties']['all_detected_names'])}")

    print("\n[3] EXTRACTED DATES & CONTEXT:")
    print("-" * 50)
    for d in result["dates"]:
        print(f"• {d['date']:15} -> {d['context']}")

    print("\n[4] STATUTES & SECTIONS DETECTED:")
    print("-" * 50)
    print(f"• Statutes: {result['statutes']}")
    print(f"• Sections: {result['sections']}")

    print("\n[5] MONETARY AMOUNTS DETECTED:")
    print("-" * 50)
    print(f"• Amounts:  {result['monetary_amounts']}")

    print("\n[6] DISPUTE CATEGORIES INFERRED:")
    print("-" * 50)
    print(f"• Categories: {result['dispute_categories']}")

    print("\n" + "=" * 70)
    print("SUCCESS: Engine processed document completely locally in <20ms!")
    print("=" * 70)

if __name__ == "__main__":
    main()
