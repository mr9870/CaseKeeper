import { Lawyer, OfficialResource, CaseItem, CaseDocument, BriefVersion, CaseTask, CaseEvent, Handoff } from './types';

export const DEMO_LAWYERS: Lawyer[] = [
  {
    id: 'lawyer-1',
    name: 'Adv. Rajeshwar Sharma',
    title: 'Senior Advocate — High Court of Delhi & Supreme Court',
    barNumber: 'D/1420/2008',
    verified: true,
    city: 'New Delhi',
    state: 'Delhi',
    experienceYears: 16,
    languages: ['Hindi', 'English', 'Punjabi'],
    practiceAreas: ['Civil Litigation', 'Property & RERA', 'Arbitration', 'Consumer Protection'],
    rating: 4.9,
    reviewsCount: 42,
    bio: 'Extensive experience in civil appellate, property partition, commercial arbitration, and Delhi High Court writ petitions. Empaneled counsel for major cooperative housing federations.',
    phone: '+91 98110 24891',
    email: 'r.sharma.adv@delhibar.org'
  },
  {
    id: 'lawyer-2',
    name: 'Adv. Priya Sundaram',
    title: 'Advocate on Record — Bombay High Court',
    barNumber: 'MAH/2918/2014',
    verified: true,
    city: 'Mumbai',
    state: 'Maharashtra',
    experienceYears: 11,
    languages: ['English', 'Hindi', 'Marathi'],
    practiceAreas: ['Consumer Disputes', 'Corporate Compliance', 'Banking Law', 'Cyber Frauds'],
    rating: 4.8,
    reviewsCount: 38,
    bio: 'Specialist in NCDRC / SCDRC consumer disputes, e-commerce grievance escalation, financial restitution claims, and cooperative banking disputes.',
    phone: '+91 98202 81923',
    email: 'priya.sundaram@mumbaicourt.in'
  },
  {
    id: 'lawyer-3',
    name: 'Adv. Vikramjit Khanna',
    title: 'Criminal Defense & Constitutional Counsel',
    barNumber: 'P&H/819/2012',
    verified: true,
    city: 'Chandigarh',
    state: 'Punjab',
    experienceYears: 13,
    languages: ['Hindi', 'English', 'Punjabi'],
    practiceAreas: ['Criminal Defense', 'Cyber Law', 'Constitutional Benches', 'Bail Writs'],
    rating: 4.9,
    reviewsCount: 57,
    bio: 'Practicing across Punjab & Haryana High Court and Sessions Courts. Expertise in bail applications under Bharatiya Nagarik Suraksha Sanhita (BNSS), FIR quashing, and cyber crime defense.',
    phone: '+91 98141 55210',
    email: 'khanna.legal@chdbar.com'
  },
  {
    id: 'lawyer-4',
    name: 'Adv. Ananya Sengupta',
    title: 'Family Court & Matrimonial Advocate',
    barNumber: 'WB/1105/2016',
    verified: true,
    city: 'Kolkata',
    state: 'West Bengal',
    experienceYears: 9,
    languages: ['Bengali', 'English', 'Hindi'],
    practiceAreas: ['Family Law', 'Matrimonial Disputes', 'Maintenance Claims', 'Child Custody'],
    rating: 4.7,
    reviewsCount: 29,
    bio: 'Compassionate representation in mutual/contested divorce, maintenance claims, domestic violence protection orders, and Hindu Succession matters before Calcutta High Court.',
    phone: '+91 98300 44192',
    email: 'ananya.sengupta@kolkatabar.in'
  },
  {
    id: 'lawyer-5',
    name: 'Adv. M. S. Venkatesh',
    title: 'Revenue & Agricultural Law Specialist',
    barNumber: 'KAR/3491/2005',
    verified: true,
    city: 'Bengaluru',
    state: 'Karnataka',
    experienceYears: 19,
    languages: ['Kannada', 'English', 'Hindi'],
    practiceAreas: ['Agricultural Disputes', 'Land Reforms', 'Revenue Court Appeals', 'Tenancy Law'],
    rating: 4.9,
    reviewsCount: 64,
    bio: 'Over 19 years handling RTC/Pahani disputes, land acquisition compensation claims, agricultural land tenancy issues, and Karnataka Land Revenue Act proceedings.',
    phone: '+91 98450 78219',
    email: 'venkatesh.agrallp@karnatakabar.org'
  },
  {
    id: 'lawyer-6',
    name: 'Adv. Arvind Shekhawat',
    title: 'RERA & Commercial Property Counsel',
    barNumber: 'RAJ/1922/2011',
    verified: true,
    city: 'Jaipur',
    state: 'Rajasthan',
    experienceYears: 14,
    languages: ['Hindi', 'English', 'Marwari'],
    practiceAreas: ['Property & RERA', 'Civil Litigation', 'Consumer Protection', 'Revenue Disputes'],
    rating: 4.8,
    reviewsCount: 46,
    bio: 'Specialist practitioner before Rajasthan RERA Bench and High Court of Judicature for Rajasthan at Jaipur. Empaneled with premier builders and property buyer associations.',
    phone: '+91 94140 33812',
    email: 'arvind.shekhawat@jaipurbar.org'
  }
];

export const DEMO_RESOURCES: OfficialResource[] = [
  {
    id: 'res-1',
    title: 'e-Courts Digital Services Portal',
    authority: 'e-Committee, Supreme Court of India',
    category: 'Court Services',
    description: 'National portal for CNR-based case status search, cause lists, daily court orders, and digital certified copies across 3,000+ court complexes nationwide.',
    url: 'https://ecourts.gov.in',
    jurisdiction: 'All India (Central)',
    lastReviewed: '15 Oct 2024',
    type: 'Judicial Record System'
  },
  {
    id: 'res-2',
    title: 'Tele-Law: Pre-Litigation Legal Advisory & NALSA 15100',
    authority: 'Department of Justice & NALSA',
    category: 'Legal Aid',
    description: 'Connects marginalized citizens to panel advocates at District Legal Services Authorities via 400,000+ Common Service Centres (CSCs) and National Legal Aid Helpline 15100.',
    url: 'https://tele-law.in',
    jurisdiction: 'All India (Toll-Free: 15100)',
    lastReviewed: '15 Jan 2026',
    type: 'Government Scheme'
  },
  {
    id: 'res-3',
    title: 'e-Jagriti & e-Daakhil Consumer Portals',
    authority: 'Department of Consumer Affairs & NCDRC',
    category: 'Consumer Complaints',
    description: 'Comprehensive e-filing ecosystem (e-Jagriti integrated with e-Daakhil) enabling digital consumer dispute submissions, fee payment, grievance tracking, and video conference hearings under Consumer Protection Act 2019.',
    url: 'https://edaakhil.nic.in',
    jurisdiction: 'District, State & National Commissions',
    lastReviewed: '20 Jan 2026',
    type: 'Filing Portal'
  },
  {
    id: 'res-4',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    authority: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agricultural Support',
    description: 'Comprehensive crop insurance coverage. Note: Localized post-harvest or calamity loss must be intimated within 72 hours via the Crop Insurance App or toll-free helpline 14447.',
    url: 'https://pmfby.gov.in',
    jurisdiction: 'All States (Agri Help: 14447)',
    lastReviewed: '20 Jan 2026',
    type: 'Direct Benefit / Insurance'
  },
  {
    id: 'res-5',
    title: 'Central Registrar of Cooperative Societies (CRCS)',
    authority: 'Ministry of Cooperation, Govt. of India',
    category: 'Cooperative Societies',
    description: 'Registration, compliance, liquidation, and refund arbitration for Multi-State Cooperative Societies under MSCS Act 2002. Portal for depositor claims.',
    url: 'https://crcs.gov.in',
    jurisdiction: 'Multi-State (National)',
    lastReviewed: '05 Nov 2024',
    type: 'Regulatory & Arbitration'
  },
  {
    id: 'res-6',
    title: 'NALSA Free Legal Services Portal & Helpline 15100',
    authority: 'National Legal Services Authority',
    category: 'Legal Aid',
    description: 'Statutory free legal aid under Section 12 of Legal Services Authorities Act 1987 for women, SC/ST, children, industrial workers, and eligible citizens. Dial National Legal Aid Helpline 15100.',
    url: 'https://nalsa.gov.in',
    jurisdiction: 'National Helpline: 15100',
    lastReviewed: '15 Jan 2026',
    type: 'Statutory Body'
  }
];

export const DEMO_CASES: CaseItem[] = [
  {
    id: 'case-101',
    title: 'Sharma v. New Era Cooperative Housing Society Ltd.',
    referenceNumber: 'ARB/ND/2026/0842',
    category: 'Cooperative Society',
    jurisdiction: 'Delhi State Registrar of Cooperatives',
    status: 'active',
    court: 'Registrar Court Bench IV, Old Secretariat Delhi',
    parties: {
      petitioner: 'Suresh Kumar Sharma',
      respondent: 'New Era Cooperative Housing Society Ltd. & Ors.'
    },
    nextHearingDate: '2026-11-28',
    lastUpdated: '2026-11-18',
    description: 'Dispute over arbitrary 24% compound interest penalty on maintenance dues, discriminatory parking stilt bay reassignment, and alleged bye-law violation regarding society maintenance reserve fund usage.',
    notes: 'Check RCS record room for 2023 AGM attendance register. File interim stay on coercive utility recovery before next listing.'
  },
  {
    id: 'case-102',
    title: 'Mehta v. Apex Reality & Infrastructure Corp.',
    referenceNumber: 'HRGR/RERA/2026/1190',
    category: 'Property & RERA',
    jurisdiction: 'Haryana Real Estate Regulatory Authority (HARERA)',
    status: 'active',
    court: 'Court Room 2, HARERA Gurugram Bench',
    parties: {
      petitioner: 'Rajeev Mehta & Sunita Mehta',
      respondent: 'Apex Reality & Infrastructure Corp.'
    },
    nextHearingDate: '2026-12-05',
    lastUpdated: '2026-11-15',
    description: 'Delay in possession beyond 36 months under Builder-Buyer Agreement. Claiming compound interest delay penalty under Section 18 of RERA Act 2016 and refund of super area escalation charges.',
    notes: 'Prepare rejoinder to builder status report. Verify escrow bank balance compliance under RERA Section 4(2)(l)(D).'
  },
  {
    id: 'case-103',
    title: 'Kisan Welfare Forum v. General Insurance Corp. & State',
    referenceNumber: 'WP(C)/8912/2026',
    category: 'Agricultural Disputes',
    jurisdiction: 'High Court of Judicature at Punjab & Haryana',
    status: 'pending',
    court: 'Division Bench II, High Court Chandigarh',
    parties: {
      petitioner: 'Kisan Welfare Forum (Sangrur Unit)',
      respondent: 'Union of India, PMFBY Nodal Agency & State of Punjab'
    },
    nextHearingDate: '2026-12-14',
    lastUpdated: '2026-11-10',
    description: 'Writ petition seeking mandamus for expedited settlement of localized crop loss indemnity under PMFBY flood season guidelines and non-payment of satellite remote sensing claims.',
    notes: 'Compile IMD rainfall data and attach survey report from District Agricultural Officer before division bench arguments.'
  },
  {
    id: 'case-104',
    title: 'Anand v. Star Horizon Electronics Pvt. Ltd.',
    referenceNumber: 'CC/312/2026',
    category: 'Consumer Complaints',
    jurisdiction: 'District Consumer Disputes Redressal Commission, South Delhi',
    status: 'active',
    court: 'Court 1, Qutub Institutional Area, New Delhi',
    parties: {
      petitioner: 'Kavita Anand',
      respondent: 'Star Horizon Electronics Pvt. Ltd.'
    },
    nextHearingDate: '2026-11-30',
    lastUpdated: '2026-11-12',
    description: 'Consumer petition under Section 35 of Consumer Protection Act 2019 for replacement or full refund with punitive damages for repeatedly malfunctioning commercial inverter system delivered with latent manufacturing defect.',
    notes: 'Submit certified service center inspection sheets and legal notice proof sent via speed post.'
  },
  {
    id: 'case-105',
    title: 'State (NCT of Delhi) v. Rawat & Anr.',
    referenceNumber: 'BAIL/THC/2026/0419',
    category: 'Criminal Matters',
    jurisdiction: 'District & Sessions Court, Central District Delhi',
    status: 'active',
    court: 'Court Room 18, Tis Hazari Courts, Delhi',
    parties: {
      petitioner: 'Amit Rawat (Applicant)',
      respondent: 'State (NCT of Delhi) through PS Kashmere Gate'
    },
    nextHearingDate: '2026-12-02',
    lastUpdated: '2026-11-17',
    description: 'Regular bail application under Section 480 of Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 in connection with FIR No. 204/2026 alleging economic misappropriation.',
    notes: 'File passport surrender undertaking and local surety solvency affidavit at morning bench call.'
  },
  {
    id: 'case-106',
    title: 'Kapoor v. Kapoor & Ors.',
    referenceNumber: 'CS(OS)/518/2026',
    category: 'Civil Disputes',
    jurisdiction: 'High Court of Delhi (Original Civil Jurisdiction)',
    status: 'active',
    court: 'Court Room 24, Hon\'ble Single Judge Bench',
    parties: {
      petitioner: 'Sunil Kapoor',
      respondent: 'Raman Kapoor, Rekha Mehra & Ors.'
    },
    nextHearingDate: '2026-12-18',
    lastUpdated: '2026-11-14',
    description: 'Civil suit for partition, rendition of accounts, and permanent injunction under Order XXXIX Rules 1 & 2 CPC in respect of ancestral residential and commercial properties situated at Karol Bagh and Connaught Place.',
    notes: 'Serve advance notice of interim stay application on caveator advocate by tomorrow afternoon.'
  }
];

export const DEMO_DOCUMENTS: CaseDocument[] = [
  {
    id: 'doc-1',
    caseId: 'case-101',
    fileName: 'Petitioner_Arbitration_Claim_Petition.pdf',
    fileSize: '3.4 MB',
    uploadDate: '2026-11-02',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 18,
    summary: 'Original claim petition filed under Section 70 of Delhi Cooperative Societies Act 2003 outlining maintenance dues disputes and illegal penal interest.'
  },
  {
    id: 'doc-2',
    caseId: 'case-101',
    fileName: 'Society_Registered_Bye_Laws_2020.pdf',
    fileSize: '8.1 MB',
    uploadDate: '2026-11-02',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 42,
    summary: 'Certified registered bye-laws of New Era Cooperative Society specifying parking allotment procedure and general body voting thresholds.'
  },
  {
    id: 'doc-3',
    caseId: 'case-101',
    fileName: 'Show_Cause_Notice_Reply_Exhibits.pdf',
    fileSize: '2.2 MB',
    uploadDate: '2026-11-14',
    processingStatus: 'done',
    extractionStatus: 'done',
    pageCount: 9,
    summary: 'Official written reply by society management committee dated 12 October 2026 citing AGM Resolution No. 4.'
  }
];

export const DEMO_BRIEF: BriefVersion = {
  id: 'brief-v3',
  caseId: 'case-101',
  versionNumber: 3,
  status: 'reviewed',
  isAiGenerated: false,
  createdAt: '2026-11-16 11:30 AM',
  reviewedAt: '2026-11-17 04:15 PM by Advocate',
  summary: 'This arbitration petition is instituted by Suresh Kumar Sharma against New Era Cooperative Housing Society Ltd. challenging illegal 24% compound interest penalties on maintenance dues, discriminatory parking stilt bay reassignment, and procedural violations in convening the Annual General Meeting. The petitioner seeks an urgent order restraining coercive recovery and restoring assigned Stilt Bay #B-14.',
  parties: [
    { name: 'Suresh Kumar Sharma', role: 'Petitioner / Member Flat 402', counsel: 'Adv. Rajesh Verma' },
    { name: 'New Era Cooperative Housing Society Ltd.', role: 'Respondent No. 1 (Society Body)', counsel: 'Adv. H. K. Singhania' },
    { name: 'Managing Committee Secretary', role: 'Respondent No. 2 (Officer)', counsel: 'Adv. H. K. Singhania' }
  ],
  keyFacts: [
    'Petitioner is an allottee-member in good standing owning Flat 402, Block B.',
    'In July 2026, the Society Management Committee arbitrarily instituted a 24% per annum compounded penalty on delayed common area contributions without registrar notification.',
    'On October 18, 2026, the Society issued a demand notice under threat of water supply disconnection.',
    'Bye-law 37(b) mandates simple interest not exceeding 9% per annum and requires prior 30-day notice with right of hearing before the Supervisory Sub-Committee.',
    'Petitioner tendered Rs. 68,000 via demand draft representing actual unpaid base maintenance, which Respondent returned uncashed.'
  ],
  importantDates: [
    { date: '2026-07-23', description: 'Impugned Special AGM Resolution No. 4 passed without mandatory quorum' },
    { date: '2026-10-18', description: 'Demand notice served on Petitioner with disconnection threat' },
    { date: '2026-11-02', description: 'Petitioner tendered DD No. 491028 for base maintenance charges' },
    { date: '2026-11-28', description: 'Next scheduled hearing before Registrar Court Bench IV' },
    { date: 'Not found in provided documents', description: 'Proof of dispatch of AGM notice to Flat 402' }
  ],
  hearingDates: [
    { date: '2026-11-08', court: 'Registrar Court Bench IV', purpose: 'First admission listing and issuance of summons' },
    { date: '2026-11-28', court: 'Registrar Court Bench IV', purpose: 'Filing of counter-affidavit by Respondent and interim stay prayer arguments' }
  ],
  suggestedTasks: [
    { task: 'Obtain certified copy of AGM attendance register from RCS record room', isSuggestion: true, due: '2026-11-25' },
    { task: 'File interim application for stay on water supply disconnection and coercive recovery', isSuggestion: false, due: '2026-11-24' },
    { task: 'Verify if Registrar approval was ever granted for amendment to Bye-law 37(b)', isSuggestion: true, due: '2026-11-26' }
  ],
  missingInformation: [
    'Actual dispatch log / postal speed-post receipts demonstrating AGM Notice service on Flat 402.',
    'Financial audit balance sheet of the Society for FY 2024-25 and FY 2025-26 to verify reserve fund balance.',
    'Written authorization letter of Respondent No. 2 to represent the Society before the Registrar.'
  ],
  documentsReviewed: [
    { name: 'Petitioner_Arbitration_Claim_Petition.pdf', pages: 18 },
    { name: 'Society_Registered_Bye_Laws_2020.pdf', pages: 42 },
    { name: 'Show_Cause_Notice_Reply_Exhibits.pdf', pages: 9 }
  ],
  citations: [
    { doc: 'Petitioner_Arbitration_Claim_Petition.pdf', page: 4, excerpt: '...society officers acted with malice by imposing 24% punitive rate without jurisdiction...' },
    { doc: 'Society_Registered_Bye_Laws_2020.pdf', page: 28, excerpt: '...Clause 37(b): Delay interest shall not exceed 9% simple interest per annum...' },
    { doc: 'Show_Cause_Notice_Reply_Exhibits.pdf', page: 3, excerpt: '...Committee stands by Resolution 4 as duly ratified by attendees...' }
  ]
};

export const DEMO_TASKS: CaseTask[] = [
  { id: 'task-1', caseId: 'case-101', title: 'File Interim Injunction against utility disconnection', dueDate: '2026-11-24', status: 'pending', isSuggestion: false, priority: 'high' },
  { id: 'task-2', caseId: 'case-101', title: 'Inspect RCS Registrar file for Bye-Law amendment proof', dueDate: '2026-11-26', status: 'pending', isSuggestion: true, priority: 'medium' },
  { id: 'task-3', caseId: 'case-101', title: 'Serve advance notice copy to Respondent advocate Singhania', dueDate: '2026-11-27', status: 'pending', isSuggestion: false, priority: 'high' },
  { id: 'task-4', caseId: 'case-102', title: 'Prepare rejoinder to builder status report in RERA', dueDate: '2026-12-03', status: 'pending', isSuggestion: false, priority: 'medium' }
];

export const DEMO_EVENTS: CaseEvent[] = [
  { id: 'ev-1', caseId: 'case-101', title: 'Arbitration Claim Registered', date: '2026-11-04', type: 'filing', source: 'manual', confirmed: true, details: 'Filing verified under Sec 70 DCS Act 2003.' },
  { id: 'ev-2', caseId: 'case-101', title: 'Summons Issued to Society MC', date: '2026-11-08', type: 'notice', source: 'extracted', confirmed: true, details: 'Summons returnable on 28 Nov 2026.' },
  { id: 'ev-3', caseId: 'case-101', title: 'Next Cause List Hearing', date: '2026-11-28', type: 'hearing', source: 'manual', confirmed: true, details: 'Arguments on application for interim stay.' }
];

export const DEMO_HANDOFFS: Handoff[] = [
  {
    id: 'ho-1',
    caseId: 'case-101',
    caseTitle: 'Sharma v. New Era Cooperative Housing Society Ltd.',
    senderName: 'Adv. Rajesh Verma',
    senderEmail: 'rajesh.verma@delhibar.org',
    recipientName: 'Adv. Ananya Sengupta',
    recipientEmail: 'ananya.sengupta@kolkatabar.in',
    status: 'accepted',
    sentDate: '2026-11-15',
    briefVersionId: 'brief-v3',
    selectedDocuments: ['doc-1', 'doc-2'],
    notes: 'Handing over briefing memo and verified bye-laws for second opinion on Delhi Cooperative Tribunal appeal route.'
  },
  {
    id: 'ho-2',
    caseId: 'case-103',
    caseTitle: 'Kisan Welfare Forum v. General Insurance Corp. & State',
    senderName: 'Adv. Vikramjit Khanna',
    senderEmail: 'khanna.legal@chdbar.com',
    recipientName: 'Adv. Rajesh Verma',
    recipientEmail: 'rajesh.verma@delhibar.org',
    status: 'sent',
    sentDate: '2026-11-18',
    briefVersionId: 'brief-v1',
    selectedDocuments: ['doc-1', 'doc-2'],
    notes: 'Inviting co-counsel assistance for High Court division bench hearing on PMFBY guidelines interpretation.'
  }
];
