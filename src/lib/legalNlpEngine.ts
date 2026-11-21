/**
 * CaseKeeper Zero-AI Legal NLP Engine (TypeScript / Next.js Native)
 * =================================================================
 * Runs 100% inside Next.js server (Node.js) or client-side.
 * Works seamlessly on Antideploy, Vercel, or local environments
 * without requiring any external Python servers or third-party AI APIs.
 */

// ─── LEGAL STOPWORDS ──────────────────────────────────────────────────────────

const LEGAL_STOPWORDS = new Set([
  'the', 'of', 'and', 'to', 'in', 'is', 'that', 'for', 'it', 'as', 'was', 'with', 
  'be', 'by', 'on', 'not', 'he', 'i', 'this', 'have', 'from', 'at', 'which', 'an', 
  'they', 'or', 'you', 'one', 'had', 'word', 'but', 'what', 'all', 'were', 
  'we', 'when', 'your', 'can', 'said', 'there', 'use', 'each', 'she', 
  'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 
  'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'him', 'into', 'time', 
  'has', 'look', 'two', 'more', 'write', 'go', 'see', 'number', 'no', 'way', 'could', 
  'people', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'oil', 'its', 'now',
  'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 'whereas',
  'herein', 'therein', 'whereby', 'hereby', 'thereof', 'hereof', 'thereto', 'hereto',
  'aforesaid', 'undersigned', 'party', 'parties', 'page', 'annexure', 'exhibit'
]);

const INDIAN_ACTS_PATTERNS = [
  /(?:Code\s+of\s+Criminal\s+Procedure|CrPC|Cr\.P\.C)(?:\s*,?\s*(?:1898|1973))?/gi,
  /(?:Indian\s+Penal\s+Code|IPC)(?:\s*,?\s*1860)?/gi,
  /(?:Real\s+Estate\s+\(Regulation\s+and\s+Development\)\s+Act|RERA\s+Act|\bRERA\b)(?:\s*,?\s*201[0-9])?/gi,
  /(?:Consumer\s+Protection\s+Act|\bCPA\b)(?:\s*,?\s*(?:1986|2019))?/gi,
  /(?:Code\s+of\s+Civil\s+Procedure|CPC|C\.P\.C)(?:\s*,?\s*1908)?/gi,
  /(?:Negotiable\s+Instruments\s+Act|NI\s+Act)(?:\s*,?\s*1881)?/gi,
  /(?:Constitution\s+of\s+India|Article\s+\d+\s+of\s+the\s+Constitution)/gi,
  /(?:Arbitration\s+and\s+Conciliation\s+Act)(?:\s*,?\s*1996)?/gi,
  /(?:Transfer\s+of\s+Property\s+Act)(?:\s*,?\s*1882)?/gi
];

const SECTION_PATTERN = /\b(?:Section|Sec\.|u\/s|U\/s|s\.|ss\.|under\s+section)\s*(\d+(?:\s*\([0-9a-zA-Z]+\))*)\b/gi;
const MONEY_PATTERN = /(?:(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{2})?(?:\s*(?:\/-|only|Lakhs?|Crores?|Cr|Lacs?))?|\b\d+\s*(?:Lakhs?|Crores?|Cr|Lacs?)\b)/gi;


// ─── TEXT PROCESSING & SENTENCE SPLITTER ──────────────────────────────────────

export function cleanText(text: string): string {
  return text
    .replace(/\r\n|\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function splitIntoSentences(text: string): string[] {
  let masked = text;
  const abbrevs = ['Adv.', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Sec.', 'u/s', 's.', 'ss.', 'vs.', 'v.', 'No.', 'Hon\'ble', 'Ltd.', 'Pvt.', 'J.'];
  abbrevs.forEach((abb, idx) => {
    masked = masked.replaceAll(abb, `__ABB${idx}__`);
  });

  const raw = masked.split(/(?<=[.!?])\s+(?=[A-Z0-9])|\n\n+/);
  const result: string[] = [];

  for (let s of raw) {
    abbrevs.forEach((abb, idx) => {
      s = s.replaceAll(`__ABB${idx}__`, abb);
    });
    s = s.trim();
    if (s.length > 25 && !s.startsWith('---') && !s.startsWith('Page ') && !s.startsWith('PAGE ')) {
      if (/[a-z]/.test(s) && s.split(/\s+/).length >= 5) {
        result.push(s);
      }
    }
  }

  return result;
}


// ─── DATES EXTRACTION ─────────────────────────────────────────────────────────

export function extractDates(text: string): Array<{ date: string; context: string; source_sentence: string }> {
  const datePatterns = [
    /\b([0-3]?[0-9][/\-\.][0-1]?[0-9][/\-\.](?:19|20)\d{2})\b/gi,
    /\b([0-3]?[0-9](?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,?\s+(?:19|20)\d{2})\b/gi,
    /\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+[0-3]?[0-9],?\s+(?:19|20)\d{2})\b/gi
  ];

  const sentences = splitIntoSentences(text);
  const found: Array<{ date: string; context: string; source_sentence: string }> = [];
  const seen = new Set<string>();

  for (const sentence of sentences) {
    for (const pattern of datePatterns) {
      pattern.lastIndex = 0;
      let m;
      while ((m = pattern.exec(sentence)) !== null) {
        const rawDate = m[1].trim();
        const key = rawDate.toLowerCase().replace(/[\s,\-\./]+/g, '');
        if (!seen.has(key)) {
          seen.add(key);
          let context = sentence.trim();
          if (context.length > 150) {
            const start = Math.max(0, m.index - 35);
            const end = Math.min(sentence.length, m.index + rawDate.length + 55);
            context = (start > 0 ? '...' : '') + sentence.slice(start, end).trim() + (end < sentence.length ? '...' : '');
          }
          found.push({
            date: rawDate,
            context,
            source_sentence: sentence
          });
        }
      }
    }
  }

  return found.slice(0, 10);
}


// ─── PARTIES & NAMES EXTRACTION ───────────────────────────────────────────────

export function extractParties(text: string): {
  petitioner: string;
  respondent: string;
  counsels: string[];
  all_names: string[];
} {
  let petitioner = '';
  let respondent = '';
  const counsels: Set<string> = new Set();
  const allNames: Set<string> = new Set();

  // Petitioner
  const petMatches = [
    /PETITIONER\s*[:\-]\s*([A-Z\s\.\&]+?)(?=\s*(?:\n|Vs\.?|V\/s|Versus|RESPONDENT))/i,
    /(?:Petitioner|Complainant|Allottee|Plaintiff)\s*[:\-]\s*([A-Z][A-Za-z\s\.\&]+?)(?=\s*(?:Versus|Vs\.?|V\/s|AND|\n|Respondent))/i,
    /Between\s*[:\-]?\s*([A-Z][A-Za-z\s\.\&]+?)(?=\s*(?:AND|Versus|Vs\.?|\n))/i
  ];
  for (const regex of petMatches) {
    const match = text.match(regex);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (candidate.length > 3 && candidate.length < 75) {
        petitioner = candidate;
        break;
      }
    }
  }

  // Respondent
  const respMatches = [
    /RESPONDENT\s*[:\-]\s*([A-Z\s\.\&0-9\(\)]+?)(?=\s*(?:\n|DATE OF JUDGMENT|BENCH|ACT|HEADNOTE|Counsel))/i,
    /(?:Respondent|Defendant|Opposite Party|Promoter|Builder)\s*[:\-]\s*([A-Z][A-Za-z0-9\s\.\&]+?)(?=\s*(?:\n|Counsel|Advocate|,|\())/i,
    /(?:Versus|Vs\.?|V\/s)\s*[:\-]?\s*([A-Z][A-Za-z0-9\s\.\&]+?)(?=\s*(?:\n|Petitioner|Respondent|Counsel|,|\())/i
  ];
  for (const regex of respMatches) {
    const match = text.match(regex);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (candidate.length > 3 && candidate.length < 80) {
        respondent = candidate;
        break;
      }
    }
  }

  // Advocates / Counsels
  const counselRegex = /\b(?:Adv\.|Advocate|Counsel)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g;
  let cm;
  while ((cm = counselRegex.exec(text)) !== null) {
    const name = cm[1].trim();
    if (name.length > 3 && name.length < 35 && !name.toLowerCase().includes('court')) {
      counsels.add(`Adv. ${name}`);
    }
  }

  // Proper Names
  const nameRegex = /\b([A-Z][a-z]+\s+(?:Kumar|Prasad|Lal|Singh|Sharma|Verma|Gupta|Mehta|Chopra|Pandey|Desai|Chaubey|Tiwary|Dusadh|Malhotra|Reddy|Rao))\b/g;
  let nm;
  while ((nm = nameRegex.exec(text)) !== null) {
    allNames.add(nm[0].trim());
  }

  return {
    petitioner: petitioner || 'Petitioner / Aggrieved Party',
    respondent: respondent || 'Respondent / Opposing Body',
    counsels: Array.from(counsels).slice(0, 5),
    all_names: Array.from(allNames).slice(0, 10)
  };
}


// ─── STATUTES & SECTIONS EXTRACTION ───────────────────────────────────────────

export function extractStatutes(text: string): {
  statutes: string[];
  sections: string[];
  monetary_amounts: string[];
} {
  const statutes = new Set<string>();
  const sections = new Set<string>();
  const money = new Set<string>();

  INDIAN_ACTS_PATTERNS.forEach(pat => {
    pat.lastIndex = 0;
    let m;
    while ((m = pat.exec(text)) !== null) {
      statutes.add(m[0].trim());
    }
  });

  SECTION_PATTERN.lastIndex = 0;
  let sm;
  while ((sm = SECTION_PATTERN.exec(text)) !== null) {
    sections.add(`Section ${sm[1].trim()}`);
  }

  MONEY_PATTERN.lastIndex = 0;
  let mm;
  while ((mm = MONEY_PATTERN.exec(text)) !== null) {
    money.add(mm[0].trim());
  }

  return {
    statutes: Array.from(statutes).slice(0, 6),
    sections: Array.from(sections).slice(0, 8),
    monetary_amounts: Array.from(money).slice(0, 6)
  };
}


// ─── EXTRACTIVE SUMMARIZATION (TF-IDF + POSITION HEURISTICS) ───────────────────

export function generateExtractiveSummary(text: string, maxSentences: number = 4): string {
  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) {
    return 'No sufficient textual content available for summarization.';
  }
  if (sentences.length <= maxSentences) {
    return sentences.join(' ');
  }

  // Word frequency
  const words = text.toLowerCase().match(/\b[a-zA-Z]{3,}\b/g) || [];
  const freqMap: Record<string, number> = {};
  let maxFreq = 1;

  words.forEach(w => {
    if (!LEGAL_STOPWORDS.has(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
      if (freqMap[w] > maxFreq) maxFreq = freqMap[w];
    }
  });

  const highPriority = new Set([
    'petitioner', 'respondent', 'prosecution', 'withdrawal', 'prosecutor', 
    'consent', 'magistrate', 'discharge', 'acquittal', 'murder', 'accused',
    'appeal', 'order', 'high', 'court', 'section', 'evidence', 'riot',
    'agreement', 'delay', 'possession', 'breach', 'complaint', 'hearing'
  ]);

  const scored: Array<{ idx: number; text: string; score: number }> = sentences.map((sent, idx) => {
    let score = 0;
    const sentWords = sent.toLowerCase().match(/\b[a-zA-Z]{3,}\b/g) || [];

    sentWords.forEach(w => {
      if (freqMap[w]) score += freqMap[w] / maxFreq;
      if (highPriority.has(w)) score += 1.8;
    });

    if (/\b\d{4}\b/.test(sent)) score += 1.2;
    if (/\b(?:Section|s\.|ss\.)\s*\d+/i.test(sent)) score += 1.5;

    // Position weighting (early paragraph & conclusion)
    const pos = idx / sentences.length;
    if (pos < 0.25) score *= 1.4;
    else if (pos > 0.85) score *= 1.2;

    const lenFactor = Math.min(Math.max(sentWords.length, 5), 35);
    const finalScore = score / lenFactor;

    return { idx, text: sent, score: finalScore };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxSentences);
  top.sort((a, b) => a.idx - b.idx);

  return top.map(t => t.text.trim()).join(' ');
}


// ─── MASTER ANALYZE FUNCTION (TYPESCRIPT NATIVE) ──────────────────────────────

export function analyzeLegalText(text: string, filename?: string) {
  const cleaned = cleanText(text);
  const summary = generateExtractiveSummary(cleaned, 4);
  const dates = extractDates(cleaned);
  const parties = extractParties(cleaned);
  const statutesInfo = extractStatutes(cleaned);

  return {
    filename: filename || 'Case_Document.pdf',
    char_count: cleaned.length,
    word_count: cleaned.split(/\s+/).length,
    summary,
    parties: {
      petitioner: parties.petitioner,
      respondent: parties.respondent,
      counsels: parties.counsels,
      all_detected_names: parties.all_names
    },
    dates,
    statutes: statutesInfo.statutes,
    sections: statutesInfo.sections,
    monetary_amounts: statutesInfo.monetary_amounts,
    dispute_categories: statutesInfo.statutes.length > 0 ? ['Criminal Law & Procedure', 'Judicial Review'] : ['Legal Dispute'],
    engine: 'CaseKeeper Zero-AI Native NLP Engine'
  };
}
