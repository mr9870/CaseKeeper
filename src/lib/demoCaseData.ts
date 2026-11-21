import { 
  CaseItem, 
  CaseDocument, 
  Contradiction, 
  EvidenceGap, 
  TimelineEvent, 
  FactVerification, 
  BriefVersion, 
  CaseTask, 
  CaseReadiness, 
  Handoff 
} from './types';

export const DEMO_CASE_ID = 'CK-2026-001';

export const PRIMARY_DEMO_CASE: CaseItem = {
  id: DEMO_CASE_ID,
  title: 'Sharma v. Horizon Developers & Promoters Pvt. Ltd.',
  referenceNumber: 'HRGR/RERA/2026/0842',
  category: 'Property & Consumer Dispute',
  jurisdiction: 'Haryana Real Estate Regulatory Authority (HARERA), Gurugram',
  status: 'active',
  court: 'Court Room 2, HARERA Gurugram Bench, Sector 14',
  parties: {
    petitioner: 'Suresh Kumar Sharma & Sunita Sharma',
    respondent: 'Horizon Developers & Promoters Pvt. Ltd.'
  },
  clientDetails: {
    name: 'Suresh Kumar Sharma',
    phone: '+91 98110 33491',
    email: 'suresh.sharma.litigant@gmail.com',
    address: 'Flat 402, Tower B, Horizon Heights, Sector 82, Gurugram, Haryana'
  },
  cnrNumber: 'HRRERA0100482026',
  assignedAdvocate: 'Adv. Rajeshwar Sharma',
  nextHearingDate: '2026-12-28',
  lastUpdated: '2026-11-20',
  description: 'Complaint under Section 18 & 31 of RERA Act 2016 alleging unilateral 16-month delay in possession of residential apartment, arbitrary ₹3,20,000 super area escalation demands, and refusal to pay statutory delay interest under Haryana RERA Rules.',
  notes: 'Client changed counsel 10 days before hearing due to previous advocate\'s lack of response. Crucial to establish that possession was contractually promised by 30 April 2025 and that extension notice was unilateral and rejected.',
  isDemo: true
};

export const DEMO_DOCUMENTS: CaseDocument[] = [
  {
    id: 'doc-demo-1',
    caseId: DEMO_CASE_ID,
    fileName: 'Agreement_For_Sale_Flat_402.pdf',
    fileSize: '4.8 MB',
    uploadDate: '2026-11-10',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 28,
    summary: 'Registered Builder-Buyer Agreement executed between Suresh Sharma and Horizon Developers specifying total consideration of ₹65,00,000, 10% advance, and firm possession date of 30 April 2025 under Clause 5(a).',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    mimeType: 'application/pdf',
    category: 'Agreement',
    fullText: `AGREEMENT FOR SALE (REGISTERED)
Date of Execution: 12 January 2023
Parties: Horizon Developers & Promoters Pvt. Ltd. (Promoter) AND Suresh Kumar Sharma (Allottee)
Unit Description: Apartment No. 402, 4th Floor, Tower B, Horizon Heights, Sector 82, Gurugram.
Total Sale Consideration: ₹65,00,000/- (Rupees Sixty Five Lakhs Only).
Clause 2(b): The project is sanctioned pursuant to DTCP License No. 44 of 2021 and Sanctioned Building Plan memo no. DTCP/ZP/2021/8891 (attached as Annexure B).
Clause 5(a) - Possession Schedule: The Promoter promises and covenants to complete construction and handover vacant possession of the Apartment on or before 30 April 2025, with a grace period of 90 days for force majeure circumstances only.
Clause 14 - Super Area: Super Area is fixed at 1,450 sq. ft. and shall not be revised upwards by more than 2% without written consent of the Allottee.`,
    pages: [
      { pageNumber: 1, text: 'AGREEMENT FOR SALE executed on 12 January 2023 between Horizon Developers and Suresh Kumar Sharma for Unit 402.' },
      { pageNumber: 4, text: 'Clause 2(b): Sanctioned plan memo DTCP/ZP/2021/8891 referred. Total agreed cost: ₹65,00,000.' },
      { pageNumber: 8, text: 'Clause 5(a) Possession Schedule: Promoter guarantees handover of vacant possession on or before 30 April 2025.' },
      { pageNumber: 14, text: 'Clause 14: Super area fixed at 1450 sq.ft. Any increase exceeding 2% requires prior written consent.' }
    ]
  },
  {
    id: 'doc-demo-2',
    caseId: DEMO_CASE_ID,
    fileName: 'Payment_Receipt_Advance_Token.pdf',
    fileSize: '1.1 MB',
    uploadDate: '2026-11-10',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 2,
    summary: 'Official stamped receipt issued by Horizon Developers acknowledging receipt of ₹5,00,000/- via cheque no. 409122 drawn on HDFC Bank towards initial booking advance.',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    mimeType: 'application/pdf',
    category: 'Financial',
    fullText: `HORIZON DEVELOPERS & PROMOTERS PVT. LTD.
OFFICIAL PAYMENT RECEIPT
Receipt No: HR/2023/8892 | Date: 12 January 2023
Received with thanks from Mr. Suresh Kumar Sharma:
Sum of Rupees: ₹5,00,000/- (Five Lakh Rupees Only)
Payment Mode: Cheque No. 409122 drawn on HDFC Bank Ltd., Connaught Place Branch.
Account Allocation: Booking advance token for Flat 402, Tower B.
Authorized Signatory: Horizon Developers Accounts Desk (Seal & Signature)`,
    pages: [
      { pageNumber: 1, text: 'Receipt No HR/2023/8892. Received ₹5,00,000 from Suresh Kumar Sharma via Cheque 409122 on 12 January 2023.' }
    ]
  },
  {
    id: 'doc-demo-3',
    caseId: DEMO_CASE_ID,
    fileName: 'Bank_Statement_HDFC_Jan2023.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-11-10',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 4,
    summary: 'Certified HDFC Bank savings account statement confirming debit of ₹5,00,000/- cleared on 14 January 2023 to Horizon Developers Escrow Account.',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    mimeType: 'application/pdf',
    category: 'Financial',
    fullText: `HDFC BANK LIMITED - ACCOUNT STATEMENT
Account Holder: Suresh Kumar Sharma | A/c No: 5010029108421
Statement Period: 01-Jan-2023 to 31-Jan-2023
14-Jan-2023: CHQ 409122 CLG TO HORIZON DEVELOPERS ESCROW A/C -- DR ₹5,00,000.00 | Balance: ₹3,42,109.40.
Certified true copy generated by Branch Manager, HDFC Bank Ltd.`,
    pages: [
      { pageNumber: 2, text: '14-Jan-2023: Debit of ₹5,00,000.00 to Horizon Developers Escrow Account via cleared Cheque 409122.' }
    ]
  },
  {
    id: 'doc-demo-4',
    caseId: DEMO_CASE_ID,
    fileName: 'Possession_Extension_Notice.pdf',
    fileSize: '1.3 MB',
    uploadDate: '2026-11-10',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 3,
    summary: 'Builder unilateral intimation letter claiming revised possession date of 15 August 2025 due to supply chain disruption and National Green Tribunal construction bans.',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    mimeType: 'application/pdf',
    category: 'Notice',
    fullText: `HORIZON DEVELOPERS & PROMOTERS PVT. LTD.
Customer Relations Desk | Ref: HD/HH/2024/771
Date: 15 November 2024
To: Mr. Suresh Kumar Sharma, Allottee Flat 402
Subject: Update on Construction Milestone & Revised Possession Timeline
Dear Allottee,
Due to unpreventable regional construction restrictions imposed by the Commission for Air Quality Management (CAQM) and severe sand supply disruptions, the anticipated date of possession for Tower B has been rescheduled.
The revised possession handover date is now 15 August 2025.
We request your cooperation as we strive to deliver the highest quality standards.`,
    pages: [
      { pageNumber: 1, text: 'Ref HD/HH/2024/771 dated 15 Nov 2024: Handover date rescheduled to 15 August 2025 citing CAQM bans.' }
    ]
  },
  {
    id: 'doc-demo-5',
    caseId: DEMO_CASE_ID,
    fileName: 'Client_Statement_Suresh_Sharma.pdf',
    fileSize: '950 KB',
    uploadDate: '2026-11-12',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 3,
    summary: 'Signed written statement by client Suresh Sharma detailing grievance history, alleging builder sales staff demanded and took ₹2,50,000 in cash in addition to the ₹5,00,000 cheque.',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    mimeType: 'application/pdf',
    category: 'Correspondence',
    fullText: `CLIENT GRIEVANCE STATEMENT
Recorded by: Adv. Rajeshwar Sharma
Deponent: Suresh Kumar Sharma, aged 54 years, s/o Sh. B. M. Sharma
I state that on 12 January 2023, I visited Horizon Developers site office. The sales executive Mr. Bhatia stated booking requires ₹7,50,000 total. I paid ₹5,00,000 by cheque and ₹2,50,000 in cash as demanded. They only issued receipt for ₹5,00,000 stating cash is adjusted in PLC.
Furthermore, the builder promised possession by April 2025. In November 2024, they unilaterally sent letter pushing possession to August 2025 and subsequently demanded ₹3.2 Lakhs extra. I have incurred ₹45,000 monthly rent due to this delay.`,
    pages: [
      { pageNumber: 1, text: 'Client statement: Alleges total advance given was ₹7,50,000 (₹5L cheque + ₹2.5L unreceipted cash).' },
      { pageNumber: 2, text: 'Alleges rental loss of ₹45,000/month caused by breach of April 2025 deadline.' }
    ]
  },
  {
    id: 'doc-demo-6',
    caseId: DEMO_CASE_ID,
    fileName: 'Builder_Demand_Notice_Escalation.pdf',
    fileSize: '1.5 MB',
    uploadDate: '2026-11-12',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 2,
    summary: 'Demand notice issued by builder demanding ₹3,20,000/- for alleged 80 sq. ft. increase in super area upon structural casting completion.',
    sha256: '8792942008e3328e34898144b62d8544c414fb6192ac793d5f3089d424b91753',
    mimeType: 'application/pdf',
    category: 'Notice',
    fullText: `DEMAND INTIMATION
Horizon Developers & Promoters Pvt. Ltd. | Date: 10 February 2025
To: Suresh Kumar Sharma | Unit: B-402
Demand: Final Architectural Super Area reconciliation indicates an expansion of 80 sq. ft. in common circulation core.
Additional Amount Payable: ₹3,20,000/- within 21 days, failing which interest at 18% per annum shall accrue.`,
    pages: [
      { pageNumber: 1, text: 'Demand notice dated 10 Feb 2025: Demanding ₹3,20,000 for 80 sq.ft. area increase under threat of 18% penalty.' }
    ]
  },
  {
    id: 'doc-demo-7',
    caseId: DEMO_CASE_ID,
    fileName: 'Legal_Notice_To_Developer_Sec18.pdf',
    fileSize: '2.1 MB',
    uploadDate: '2026-11-12',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 5,
    summary: 'Statutory legal notice issued by advocate demanding withdrawal of illegal escalation charges and payment of monthly delay compensation under Section 18 of RERA Act 2016.',
    sha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    mimeType: 'application/pdf',
    category: 'Pleading',
    fullText: `LEGAL NOTICE UNDER SECTION 18 & 31 OF REAL ESTATE (REGULATION & DEVELOPMENT) ACT, 2016
Date: 24 March 2026
From: Adv. Rajeshwar Sharma, Chamber 412, Delhi High Court
To: The Board of Directors, Horizon Developers & Promoters Pvt. Ltd.
Sirs,
Under instructions from our client Suresh Kumar Sharma, you are called upon to:
1. Cease and desist from demanding ₹3,20,000 which directly violates Clause 14 of the Registered Agreement for Sale.
2. Formally commit to handing over vacant physical possession along with valid Occupancy Certificate.
3. Pay monthly delayed interest at SBI MCLR + 2% per annum from 30 April 2025 until actual delivery.
Failing compliance within 15 days, appropriate complaints shall be prosecuted before HARERA Gurugram.`,
    pages: [
      { pageNumber: 2, text: 'Notice grounds: Clause 14 violation regarding unauthorized super area expansion.' },
      { pageNumber: 3, text: 'Demand for statutory interest at SBI MCLR + 2% from contractual due date 30 April 2025.' }
    ]
  },
  {
    id: 'doc-demo-8',
    caseId: DEMO_CASE_ID,
    fileName: 'Haryana_RERA_Hearing_Notice.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-11-14',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 2,
    summary: 'Official summons issued by the Registrar, Haryana Real Estate Regulatory Authority listing Case No. HRGR/RERA/2026/0842 for hearing on 28 December 2026.',
    sha256: '5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03',
    mimeType: 'application/pdf',
    category: 'Pleading',
    fullText: `BEFORE THE HARYANA REAL ESTATE REGULATORY AUTHORITY, GURUGRAM
Case No: HRGR/RERA/2026/0842
Suresh Kumar Sharma vs. Horizon Developers & Promoters Pvt. Ltd.
NOTICE OF LISTING
Take notice that the above captioned complaint under Section 31 of RERA Act 2016 stands admitted and listed for hearing before Bench Room 2 on 28 December 2026 at 11:30 AM.
The Respondent is directed to file its counter-affidavit along with certified project progress charts 7 days prior to listing.`,
    pages: [
      { pageNumber: 1, text: 'Official Summons: Listing fixed before HARERA Bench Room 2 on 28 December 2026 at 11:30 AM.' }
    ]
  },
  {
    id: 'doc-demo-9',
    caseId: DEMO_CASE_ID,
    fileName: 'Hindi_Correspondence_Society_Samiti.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-11-14',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 3,
    summary: 'Hindi formal representation letter from Allottees Welfare Association regarding incomplete Occupancy Certificate and illegal stilt parking charges.',
    sha256: '3a4c56e2978f88880e60321a5a8e2910d6e6a394f48b9f1a238475928d103829',
    mimeType: 'application/pdf',
    category: 'Correspondence',
    fullText: `होराइजन हाइट्स रेजिडेंट्स वेलफेयर एसोसिएशन (पंजीकृत)
दिनांक: 04 अक्टूबर 2025
सेवा में,
जिला नगर योजनाकार (DTP), नगर एवं ग्राम आयोजना विभाग, गुरुग्राम।
विषय: होराइजन हाइट्स सेक्टर 82 में अवैध शुल्क एवं अधिभोग प्रमाणपत्र (OC) के बिना कब्जा देने के संबंध में।
महोदय,
निवेदन है कि बिल्डर मेसर्स होराइजन डेवलपर्स द्वारा टॉवर B में बिना वैध ओसी (Occupancy Certificate) के कब्जा लेने का दबाव बनाया जा रहा है। इसके अतिरिक्त प्रत्येक खरीदार से स्टिल्ट पार्किंग के नाम पर ₹1,50,000 अतिरिक्त मांगे जा रहे हैं, जो कि रेरा नियमों का खुला उल्लंघन है।
कृपया तत्काल स्थल निरीक्षण कर कार्रवाई करने का कष्ट करें।
हस्ताक्षर: समस्त पीड़ित आवंटी गण।`,
    pages: [
      { pageNumber: 1, text: 'हिंदी पत्र: टावर B में बिना वैध अधिभोग प्रमाणपत्र (OC) के कब्जा देने का आरोप एवं अवैध पार्किंग शुल्क की शिकायत।' }
    ]
  }
];

export const DEMO_CONTRADICTIONS: Contradiction[] = [
  {
    id: 'contra-1',
    caseId: DEMO_CASE_ID,
    title: 'Contractual Possession Date Conflict',
    category: 'contradiction',
    significance: 'high',
    explanation: 'The Registered Agreement for Sale legally obligates handover on or before 30 April 2025 (Clause 5a). However, the builder unilaterally asserted a revised date of 15 August 2025 in their correspondence citing CAQM bans, without an executed amendment.',
    valueA: {
      statement: 'Guaranteed vacant possession on or before 30 April 2025 with max 90-day grace period.',
      source: {
        docId: 'doc-demo-1',
        docName: 'Agreement_For_Sale_Flat_402.pdf',
        pageNumber: 8,
        excerpt: 'Clause 5(a): The Promoter covenants to complete construction and handover vacant possession on or before 30 April 2025.',
        charOffset: 412
      }
    },
    valueB: {
      statement: 'Unilateral extension asserting handover is revised to 15 August 2025.',
      source: {
        docId: 'doc-demo-4',
        docName: 'Possession_Extension_Notice.pdf',
        pageNumber: 1,
        excerpt: 'The revised possession handover date is now 15 August 2025.',
        charOffset: 120
      }
    },
    resolutionStatus: 'unresolved',
    advocateNotes: 'Argue before HARERA that unilateral letters cannot modify registered bilateral agreement terms. Claim statutory interest from 1 May 2025.'
  },
  {
    id: 'contra-2',
    caseId: DEMO_CASE_ID,
    title: 'Advance Payment Discrepancy (Documented vs Client Allegation)',
    category: 'ambiguous',
    significance: 'medium',
    explanation: 'Official Bank Statement and Builder Payment Receipt confirm an exact advance of ₹5,00,000/-. However, the client grievance statement asserts that ₹7,50,000/- was paid (alleging ₹2,50,000 unreceipted cash handed to sales agent).',
    valueA: {
      statement: 'Documented advance payment of ₹5,00,000/- via HDFC Cheque No. 409122.',
      source: {
        docId: 'doc-demo-2',
        docName: 'Payment_Receipt_Advance_Token.pdf',
        pageNumber: 1,
        excerpt: 'Sum of Rupees: ₹5,00,000/- (Five Lakh Rupees Only) via Cheque No. 409122 drawn on HDFC Bank Ltd.',
        charOffset: 140
      }
    },
    valueB: {
      statement: 'Client statement alleging total advance given was ₹7,50,000/- including cash component.',
      source: {
        docId: 'doc-demo-5',
        docName: 'Client_Statement_Suresh_Sharma.pdf',
        pageNumber: 1,
        excerpt: 'I paid ₹5,00,000 by cheque and ₹2,50,000 in cash as demanded. They only issued receipt for ₹5,00,000.',
        charOffset: 89
      }
    },
    resolutionStatus: 'unresolved',
    advocateNotes: 'Advise client that unreceipted cash claim cannot be substantiated before RERA bench without contemporaneous proof. Base formal petition strictly on ₹5,00,000 documented advance.'
  }
];

export const DEMO_EVIDENCE_GAPS: EvidenceGap[] = [
  {
    id: 'gap-1',
    caseId: DEMO_CASE_ID,
    itemTitle: 'DTCP Sanctioned Building Plan (Annexure B)',
    category: 'Statutory Approval',
    reason: 'Referenced explicitly in Agreement Clause 2(b) ("Sanctioned Building Plan memo no. DTCP/ZP/2021/8891"), but the physical drawing sheets and memo are missing from the case folder.',
    missingType: 'reference_detected',
    referencedInDoc: 'Agreement_For_Sale_Flat_402.pdf (Page 4)',
    priority: 'high',
    status: 'missing',
    suggestedAction: 'File an RTI or requisition certified layout copies from District Town Planner (DTP) office Gurugram to verify whether Tower B height was legally approved.'
  },
  {
    id: 'gap-2',
    caseId: DEMO_CASE_ID,
    itemTitle: 'Valid Occupancy Certificate (OC) / Completion Certificate (CC)',
    category: 'Statutory Approval',
    reason: 'RERA Section 11(4)(b) forbids handing over possession without a valid OC. Hindi correspondence indicates builder is forcing possession without OC.',
    missingType: 'checklist',
    priority: 'high',
    status: 'missing',
    suggestedAction: 'Require respondent developer in counter-affidavit to produce certified copy of OC issued by competent authority.'
  },
  {
    id: 'gap-3',
    caseId: DEMO_CASE_ID,
    itemTitle: 'Postal Speed-Post Tracking Delivery Proof of Legal Notice',
    category: 'Proof of Service',
    reason: 'Legal Notice dated 24 March 2026 was uploaded, but the India Post speed post receipt and online delivery confirmation track-report are missing.',
    missingType: 'checklist',
    priority: 'medium',
    status: 'missing',
    suggestedAction: 'Locate original booking slip barcode (ED...IN) and download consignment tracking report from indiapost.gov.in before hearing.'
  }
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'time-1',
    caseId: DEMO_CASE_ID,
    date: '2023-01-12',
    title: 'Agreement for Sale Executed & Advance Token Paid',
    details: 'Registered Agreement for Sale signed at Sub-Registrar Gurugram. Suresh Sharma tendered ₹5,00,000 cheque towards booking Unit 402, Tower B.',
    eventType: 'agreement',
    dateType: 'actual',
    datePrecision: 'exact',
    source: {
      docId: 'doc-demo-1',
      docName: 'Agreement_For_Sale_Flat_402.pdf',
      pageNumber: 1,
      excerpt: 'AGREEMENT FOR SALE executed on 12 January 2023 between Horizon Developers and Suresh Kumar Sharma.'
    },
    reviewStatus: 'verified',
    associatedDocuments: ['Agreement_For_Sale_Flat_402.pdf', 'Payment_Receipt_Advance_Token.pdf']
  },
  {
    id: 'time-2',
    caseId: DEMO_CASE_ID,
    date: '2023-01-14',
    title: 'HDFC Escrow Cheque Clearance',
    details: 'HDFC Bank savings account reflects successful clearing of Cheque No. 409122 for ₹5,00,000 into Horizon Developers Escrow A/c.',
    eventType: 'payment',
    dateType: 'actual',
    datePrecision: 'exact',
    source: {
      docId: 'doc-demo-3',
      docName: 'Bank_Statement_HDFC_Jan2023.pdf',
      pageNumber: 2,
      excerpt: '14-Jan-2023: CHQ 409122 CLG TO HORIZON DEVELOPERS ESCROW A/C -- DR ₹5,00,000.00'
    },
    reviewStatus: 'verified',
    associatedDocuments: ['Bank_Statement_HDFC_Jan2023.pdf']
  },
  {
    id: 'time-3',
    caseId: DEMO_CASE_ID,
    date: '2024-11-15',
    title: 'Unilateral Possession Extension Letter Issued',
    details: 'Horizon Developers issued letter HD/HH/2024/771 unilaterally delaying handover date to 15 August 2025 citing CAQM pollution restrictions.',
    eventType: 'notice',
    dateType: 'actual',
    datePrecision: 'exact',
    source: {
      docId: 'doc-demo-4',
      docName: 'Possession_Extension_Notice.pdf',
      pageNumber: 1,
      excerpt: 'The revised possession handover date is now 15 August 2025.'
    },
    reviewStatus: 'flagged',
    associatedDocuments: ['Possession_Extension_Notice.pdf']
  },
  {
    id: 'time-4',
    caseId: DEMO_CASE_ID,
    date: '2025-02-10',
    title: 'Super Area Escalation Demand of ₹3,20,000',
    details: 'Developer demanded ₹3,20,000 claiming 80 sq. ft. increase in common circulation core under threat of 18% annual penalty.',
    eventType: 'notice',
    dateType: 'actual',
    datePrecision: 'exact',
    source: {
      docId: 'doc-demo-6',
      docName: 'Builder_Demand_Notice_Escalation.pdf',
      pageNumber: 1,
      excerpt: 'Additional Amount Payable: ₹3,20,000/- within 21 days, failing which interest at 18% per annum shall accrue.'
    },
    reviewStatus: 'verified',
    associatedDocuments: ['Builder_Demand_Notice_Escalation.pdf']
  },
  {
    id: 'time-5',
    caseId: DEMO_CASE_ID,
    date: '2025-04-30',
    title: 'Contractual Possession Due Date Breached',
    details: 'Original contractual possession deadline stipulated under Clause 5(a) expired without handover of apartment or grant of Occupancy Certificate.',
    eventType: 'agreement',
    dateType: 'deadline',
    datePrecision: 'exact',
    source: {
      docId: 'doc-demo-1',
      docName: 'Agreement_For_Sale_Flat_402.pdf',
      pageNumber: 8,
      excerpt: 'Promoter covenants to complete construction and handover vacant possession on or before 30 April 2025.'
    },
    reviewStatus: 'verified',
    associatedDocuments: ['Agreement_For_Sale_Flat_402.pdf']
  },
  {
    id: 'time-6',
    caseId: DEMO_CASE_ID,
    date: '2026-03-24',
    title: 'Statutory Legal Notice Dispatched under RERA Sec 18',
    details: 'Formal advocate notice dispatched demanding immediate stay on illegal escalation charges and payment of statutory delayed possession compensation.',
    eventType: 'communication',
    dateType: 'actual',
    datePrecision: 'exact',
    source: {
      docId: 'doc-demo-7',
      docName: 'Legal_Notice_To_Developer_Sec18.pdf',
      pageNumber: 2,
      excerpt: 'Demand for statutory interest at SBI MCLR + 2% from contractual due date 30 April 2025.'
    },
    reviewStatus: 'verified',
    associatedDocuments: ['Legal_Notice_To_Developer_Sec18.pdf']
  },
  {
    id: 'time-7',
    caseId: DEMO_CASE_ID,
    date: '2026-11-14',
    title: 'HARERA Complaint Admitted & Hearing Summons Issued',
    details: 'HARERA Gurugram Registry formally registered complaint HRGR/RERA/2026/0842 and scheduled admission listing before Bench Room 2.',
    eventType: 'hearing',
    dateType: 'deadline',
    datePrecision: 'exact',
    source: {
      docId: 'doc-demo-8',
      docName: 'Haryana_RERA_Hearing_Notice.pdf',
      pageNumber: 1,
      excerpt: 'Complaint under Section 31 of RERA Act 2016 stands admitted and listed for hearing before Bench Room 2 on 28 December 2026.'
    },
    reviewStatus: 'verified',
    associatedDocuments: ['Haryana_RERA_Hearing_Notice.pdf']
  },
  {
    id: 'time-8',
    caseId: DEMO_CASE_ID,
    date: '2026-12-28',
    title: 'Upcoming Bench Hearing before HARERA Gurugram',
    details: 'Scheduled physical/hybrid listing before HARERA Bench Room 2 for consideration of interim stay on escalation charges and directions for project audit.',
    eventType: 'hearing',
    dateType: 'expected',
    datePrecision: 'exact',
    reviewStatus: 'pending'
  }
];

export const DEMO_FACT_VERIFICATIONS: FactVerification[] = [
  {
    id: 'fact-1',
    caseId: DEMO_CASE_ID,
    category: 'possession',
    factText: 'Contractual possession was agreed to be handed over on or before 30 April 2025 under registered Agreement Clause 5(a).',
    status: 'verified',
    reviewerName: 'Adv. Rajeshwar Sharma',
    reviewTimestamp: '2026-11-15 14:30',
    source: {
      docId: 'doc-demo-1',
      docName: 'Agreement_For_Sale_Flat_402.pdf',
      pageNumber: 8,
      excerpt: 'Clause 5(a): Promoter covenants to complete construction and handover vacant possession on or before 30 April 2025.',
      charOffset: 412
    }
  },
  {
    id: 'fact-2',
    caseId: DEMO_CASE_ID,
    category: 'financial',
    factText: 'Suresh Sharma paid ₹5,00,000/- advance booking consideration via verified HDFC Bank Cheque 409122 on 12 January 2023.',
    status: 'verified',
    reviewerName: 'Adv. Rajeshwar Sharma',
    reviewTimestamp: '2026-11-15 14:35',
    source: {
      docId: 'doc-demo-2',
      docName: 'Payment_Receipt_Advance_Token.pdf',
      pageNumber: 1,
      excerpt: 'Receipt No: HR/2023/8892... Sum of Rupees: ₹5,00,000/- via Cheque No. 409122',
      charOffset: 140
    }
  },
  {
    id: 'fact-3',
    caseId: DEMO_CASE_ID,
    category: 'financial',
    factText: 'Additional ₹2,50,000/- cash advance was paid to developer without formal receipt.',
    status: 'unsupported',
    reviewerName: 'Adv. Rajeshwar Sharma',
    reviewTimestamp: '2026-11-15 14:40',
    correctedText: 'Alleged by client in oral statement but lacks documentary receipts or banking proof. Excluded from primary RERA petition prayer.',
    correctionReason: 'Unsupported by bank records or stamped builder receipts.',
    source: {
      docId: 'doc-demo-5',
      docName: 'Client_Statement_Suresh_Sharma.pdf',
      pageNumber: 1,
      excerpt: 'I paid ₹5,00,000 by cheque and ₹2,50,000 in cash as demanded. They only issued receipt for ₹5,00,000.',
      charOffset: 89
    }
  },
  {
    id: 'fact-4',
    caseId: DEMO_CASE_ID,
    category: 'possession',
    factText: 'Builder unilaterally issued letter HD/HH/2024/771 on 15 Nov 2024 purporting to defer possession to 15 August 2025 without buyer consent.',
    status: 'verified',
    reviewerName: 'Adv. Rajeshwar Sharma',
    reviewTimestamp: '2026-11-15 14:45',
    source: {
      docId: 'doc-demo-4',
      docName: 'Possession_Extension_Notice.pdf',
      pageNumber: 1,
      excerpt: 'The revised possession handover date is now 15 August 2025.',
      charOffset: 120
    }
  },
  {
    id: 'fact-5',
    caseId: DEMO_CASE_ID,
    category: 'statutory_ground',
    factText: 'Allottees are entitled to prescribed interest at SBI MCLR + 2% per annum from 30 April 2025 under Section 18 of RERA Act 2016.',
    status: 'verified',
    reviewerName: 'Adv. Rajeshwar Sharma',
    reviewTimestamp: '2026-11-15 15:00',
    source: {
      docId: 'doc-demo-7',
      docName: 'Legal_Notice_To_Developer_Sec18.pdf',
      pageNumber: 3,
      excerpt: 'Demand for statutory interest at SBI MCLR + 2% from contractual due date 30 April 2025.',
      charOffset: 250
    }
  }
];

export const DEMO_CASE_READINESS: CaseReadiness = {
  overallScore: 82,
  sourceReferenceCoverage: 94,   // 40% weight -> 37.6%
  checklistCoverage: 75,         // 25% weight -> 18.75%
  advocateReviewCompletion: 80,  // 20% weight -> 16.0%
  discrepancyResolution: 65,     // 15% weight -> 9.75%
  totalFactsCount: 16,
  verifiedFactsCount: 13,
  unresolvedDiscrepancyCount: 2,
  missingChecklistCount: 3,
  disclaimer: 'This score measures documentation completeness, source pin coverage, and advocate review readiness. It does not predict legal outcomes, case merit, or judicial probability of success.'
};

export const DEMO_BRIEF: BriefVersion = {
  id: 'brief-CK-2026-001-v3',
  caseId: DEMO_CASE_ID,
  versionNumber: 3,
  status: 'reviewed',
  isAiGenerated: true,
  createdAt: '2026-11-15 11:30 AM',
  reviewedAt: '2026-11-16 04:30 PM by Adv. Rajeshwar Sharma',
  summary: 'Complaint instituted under Section 31 of RERA Act 2016 by Suresh Kumar Sharma against Horizon Developers & Promoters Pvt. Ltd. concerning Unit 402, Horizon Heights, Sector 82, Gurugram. The complainant booked the apartment on 12 January 2023 for ₹65,00,000/- and tendered ₹5,00,000/- advance. Clause 5(a) of the Registered Agreement contractually guaranteed possession by 30 April 2025. In November 2024, the developer unilaterally deferred handover to 15 August 2025 and subsequently demanded ₹3,20,000/- for unauthorized super area expansion. Complainant seeks an interim stay on coercive escalation recovery, physical possession with valid Occupancy Certificate, and statutory delayed possession interest under RERA Section 18.',
  parties: [
    { name: 'Suresh Kumar Sharma & Sunita Sharma', role: 'Complainant / Allottee Flat 402', counsel: 'Adv. Rajeshwar Sharma' },
    { name: 'Horizon Developers & Promoters Pvt. Ltd.', role: 'Respondent / Promoter Body', counsel: 'Notice Issued (Bench Room 2)' }
  ],
  keyFacts: [
    'Unit 402 booked on 12 January 2023 under registered Agreement for Sale for total consideration of ₹65,00,000.',
    'Advance payment of ₹5,00,000 verified via HDFC Bank Cheque No. 409122 and stamped builder receipt HR/2023/8892.',
    'Contractual possession date under Clause 5(a) was 30 April 2025; expired without delivery of apartment or valid OC.',
    'Builder unilaterally extended possession to 15 August 2025 without executing an addendum or securing buyer consent.',
    'Builder issued demand notice on 10 February 2025 claiming ₹3,20,000 for 80 sq.ft. super area increase in direct violation of Clause 14.',
    'Hindi correspondence from Resident Welfare Association demonstrates tower construction remains incomplete without Occupancy Certificate.'
  ],
  materialAssertions: [
    {
      id: 'mat-1',
      assertion: 'Possession guaranteed on or before 30 April 2025 under Agreement Clause 5(a).',
      source: {
        docId: 'doc-demo-1',
        docName: 'Agreement_For_Sale_Flat_402.pdf',
        pageNumber: 8,
        excerpt: 'Clause 5(a): Handover vacant possession on or before 30 April 2025.'
      },
      status: 'verified'
    },
    {
      id: 'mat-2',
      assertion: 'Advance payment of ₹5,00,000 deposited on 12 January 2023.',
      source: {
        docId: 'doc-demo-2',
        docName: 'Payment_Receipt_Advance_Token.pdf',
        pageNumber: 1,
        excerpt: 'Sum of Rupees: ₹5,00,000/- via Cheque No. 409122'
      },
      status: 'verified'
    },
    {
      id: 'mat-3',
      assertion: 'Unilateral extension notice issued on 15 November 2024.',
      source: {
        docId: 'doc-demo-4',
        docName: 'Possession_Extension_Notice.pdf',
        pageNumber: 1,
        excerpt: 'The revised possession handover date is now 15 August 2025.'
      },
      status: 'verified'
    },
    {
      id: 'mat-4',
      assertion: 'Complainant incurred monthly rent of ₹45,000 due to delayed possession.',
      source: {
        docId: 'doc-demo-5',
        docName: 'Client_Statement_Suresh_Sharma.pdf',
        pageNumber: 2,
        excerpt: 'I have incurred ₹45,000 monthly rent due to this delay.'
      },
      status: 'pending'
    }
  ],
  importantDates: [
    { date: '2023-01-12', description: 'Agreement for Sale executed and ₹5,00,000 advance receipt issued' },
    { date: '2023-01-14', description: 'HDFC Bank Cheque No. 409122 cleared into Horizon Escrow Account' },
    { date: '2024-11-15', description: 'Builder unilaterally issued letter pushing possession to 15 August 2025' },
    { date: '2025-02-10', description: 'Developer served ₹3,20,000 escalation notice for alleged super area increase' },
    { date: '2025-04-30', description: 'Contractual possession due date under Clause 5(a) breached' },
    { date: '2026-03-24', description: 'Advocate Legal Notice served under RERA Section 18 & 31' },
    { date: '2026-11-14', description: 'HARERA Complaint HRGR/RERA/2026/0842 formally admitted' },
    { date: '2026-12-28', description: 'Next scheduled hearing before HARERA Bench Room 2' }
  ],
  hearingDates: [
    { date: '2026-11-14', court: 'HARERA Bench Room 2', purpose: 'First admission listing and issuance of summons' },
    { date: '2026-12-28', court: 'HARERA Bench Room 2', purpose: 'Filing of counter-affidavit by promoter & interim stay arguments' }
  ],
  suggestedTasks: [
    { task: 'Obtain certified copy of DTCP Sanctioned Building Plan memo no. DTCP/ZP/2021/8891', isSuggestion: true, due: '2026-12-10' },
    { task: 'Download Speed Post delivery tracking confirmation report for Legal Notice', isSuggestion: false, due: '2026-12-14' },
    { task: 'File interim application restraining builder from coercive escalation charges or cancellation', isSuggestion: false, due: '2026-12-20' },
    { task: 'Verify developer escrow bank balance under RERA Section 4(2)(l)(D)', isSuggestion: true, due: '2026-12-22' }
  ],
  missingInformation: [
    'DTCP Sanctioned Building Plan drawings referenced in Agreement Clause 2(b)',
    'Valid Occupancy Certificate (OC) / Completion Certificate (CC) for Tower B',
    'Consignment tracking report confirming delivery date of Legal Notice dated 24 March 2026'
  ],
  documentsReviewed: [
    { name: 'Agreement_For_Sale_Flat_402.pdf', pages: 28 },
    { name: 'Payment_Receipt_Advance_Token.pdf', pages: 2 },
    { name: 'Bank_Statement_HDFC_Jan2023.pdf', pages: 4 },
    { name: 'Possession_Extension_Notice.pdf', pages: 3 },
    { name: 'Client_Statement_Suresh_Sharma.pdf', pages: 3 },
    { name: 'Builder_Demand_Notice_Escalation.pdf', pages: 2 },
    { name: 'Legal_Notice_To_Developer_Sec18.pdf', pages: 5 },
    { name: 'Haryana_RERA_Hearing_Notice.pdf', pages: 2 },
    { name: 'Hindi_Correspondence_Society_Samiti.pdf', pages: 3 }
  ],
  citations: [
    { doc: 'Agreement_For_Sale_Flat_402.pdf', page: 8, excerpt: 'Clause 5(a): The Promoter covenants to complete construction and handover vacant possession on or before 30 April 2025.' },
    { doc: 'Agreement_For_Sale_Flat_402.pdf', page: 14, excerpt: 'Clause 14: Super Area is fixed at 1,450 sq. ft. and shall not be revised upwards by more than 2% without written consent.' },
    { doc: 'Payment_Receipt_Advance_Token.pdf', page: 1, excerpt: 'Received sum of ₹5,00,000/- via Cheque No. 409122 drawn on HDFC Bank Ltd.' },
    { doc: 'Possession_Extension_Notice.pdf', page: 1, excerpt: 'The revised possession handover date is now 15 August 2025.' },
    { doc: 'Builder_Demand_Notice_Escalation.pdf', page: 1, excerpt: 'Additional Amount Payable: ₹3,20,000/- within 21 days, failing which interest at 18% shall accrue.' },
    { doc: 'Legal_Notice_To_Developer_Sec18.pdf', page: 3, excerpt: 'Demand for statutory interest at SBI MCLR + 2% from contractual due date 30 April 2025.' },
    { doc: 'Haryana_RERA_Hearing_Notice.pdf', page: 1, excerpt: 'Complaint under Section 31 stands admitted and listed before Bench Room 2 on 28 December 2026.' }
  ],
  confidentialNotesExcluded: true
};

export const DEMO_TASKS: CaseTask[] = [
  { id: 'task-demo-1', caseId: DEMO_CASE_ID, title: 'File Interim Stay application against ₹3,20,000 escalation recovery', dueDate: '2026-12-18', status: 'pending', isSuggestion: false, priority: 'high' },
  { id: 'task-demo-2', caseId: DEMO_CASE_ID, title: 'Obtain certified copy of DTCP Building Sanction Plan from DTP Gurugram', dueDate: '2026-12-10', status: 'pending', isSuggestion: true, priority: 'medium' },
  { id: 'task-demo-3', caseId: DEMO_CASE_ID, title: 'Download speed-post delivery report for Legal Notice', dueDate: '2026-12-14', status: 'completed', isSuggestion: false, priority: 'medium' },
  { id: 'task-demo-4', caseId: DEMO_CASE_ID, title: 'Prepare rejoinder to builder counter-affidavit before Bench Room 2 listing', dueDate: '2026-12-24', status: 'pending', isSuggestion: false, priority: 'high' }
];

export const DEMO_HANDOFF: Handoff = {
  id: 'ho-demo-1',
  caseId: DEMO_CASE_ID,
  caseTitle: 'Sharma v. Horizon Developers & Promoters Pvt. Ltd.',
  senderName: 'Adv. Rajeshwar Sharma',
  senderEmail: 'r.sharma.adv@delhibar.org',
  recipientName: 'Adv. Priya Sundaram',
  recipientEmail: 'priya.sundaram@mumbaicourt.in',
  status: 'sent',
  sentDate: '2026-11-18',
  expiryDate: '2026-12-30',
  briefVersionId: 'brief-CK-2026-001-v3',
  selectedDocuments: [
    'Agreement_For_Sale_Flat_402.pdf',
    'Payment_Receipt_Advance_Token.pdf',
    'Bank_Statement_HDFC_Jan2023.pdf',
    'Possession_Extension_Notice.pdf',
    'Legal_Notice_To_Developer_Sec18.pdf',
    'Haryana_RERA_Hearing_Notice.pdf'
  ],
  includeTimeline: true,
  includeDiscrepancies: true,
  includeGaps: true,
  includeTasks: true,
  notes: 'Transferred for urgent filing of interim stay application before HARERA Bench Room 2 on 28 December 2026. Private client notes and oral cash allegations are strictly excluded from this handoff package.',
  clientConsentRecorded: true,
  clientConsentTimestamp: '2026-11-17 18:20 IST',
  accessLog: [
    { accessedAt: '2026-11-19 10:14 IST', ip: '103.21.58.12', action: 'Recipient opened Case Brief v3' },
    { accessedAt: '2026-11-19 10:18 IST', ip: '103.21.58.12', action: 'Recipient downloaded Agreement_For_Sale_Flat_402.pdf' }
  ]
};
