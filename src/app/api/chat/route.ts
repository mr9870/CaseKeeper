import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { DEMO_RESOURCES } from '@/lib/mockData';

function buildSystemPrompt(language: string) {
  const isHindi = language === 'hi';
  return `You are CaseKeeper Legal Assistant, an AI legal assistant dedicated to Indian civic legal literacy and statutory guidance.

Target Language: ${isHindi ? 'HINDI (हिंदी) — Provide your entire response in clear, formal, and polite Hindi using Devanagari script.' : 'ENGLISH — Provide your entire response in clear, formal, and structured English.'}

Key Domains of Knowledge:
1. **Consumer Protection (उपभोक्ता संरक्षण)** — Consumer Protection Act, 2019 (Sections 35, 38): e-Jagriti & e-Daakhil filing, District/State/National Commissions, 2-year limitation period.
2. **Crop Insurance (PMFBY / फसल बीमा)** — Pradhan Mantri Fasal Bima Yojana: Mandatory 72-hour reporting rule for localized crop loss to bank or portal, claim process, grievance escalation.
3. **Cooperative Societies (सहकारी समितियां)** — Multi-State Cooperative Societies Act & state acts: bye-law disputes, illegal maintenance charges, Registrar bench remedies.
4. **Free Legal Aid (मुफ्त कानूनी सहायता - NALSA)** — Legal Services Authorities Act, 1987 (Section 12): eligibility (income <= 1 lakh, women, children, SC/ST, custody, industrial workers), DLSA/SLSA help.
5. **Property & RERA (रियल एस्टेट)** — RERA Act, 2016: builder delay compensation (Section 18), complaint filing with state RERA.
6. **e-Courts & Case Status** — CNR number lookup on e-Courts portal, tracking hearing dates, cause lists.
7. **Criminal Procedure (आपराधिक प्रक्रिया)** — Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 / CrPC: FIR rights, zero FIR, bail provisions.

STRICT INSTRUCTIONS:
- Directly answer the citizen's specific question with step-by-step guidance.
${isHindi ? '- उत्तर पूरी तरह से शुद्ध और सरल हिंदी में दें।' : '- Respond in clear, structured English with bullet points and bold headers.'}
- Base your answers strictly on Indian statutes and schemes. Do not invent non-existent sections or case citations.
- Always include a concluding disclaimer: ${isHindi ? '"⚠️ यह केवल सामान्य कानूनी जानकारी और नागरिक जागरूकता के लिए है, कोई औपचारिक कानूनी सलाह या वकालत नहीं। औपचारिक सहायता के लिए निकटतम जिला विधिक सेवा प्राधिकरण (DLSA) या पंजीकृत अधिवक्ता से संपर्क करें।"' : '"⚠️ This is general statutory information for civic awareness only and does not constitute formal legal advice or advocate representation. For formal legal representation, please contact a registered advocate or your nearest DLSA/SLSA office."'}`;
}

const HINDI_FALLBACK = `नमस्ते! CaseKeeper कानूनी सहायक में आपका स्वागत है।

भारतीय कानूनी प्रावधानों के अनुसार महत्वपूर्ण नागरिक अधिकार:

1. **उपभोक्ता शिकायतें (उपभोक्ता संरक्षण अधिनियम 2019):**
   - उपभोक्ता सीधे ई-दाखिल पोर्टल (edaakhil.nic.in) पर ऑनलाइन शिकायत दर्ज कर सकते हैं।
   - 50 लाख रुपये तक के दावों के लिए जिला उपभोक्ता आयोग में वकील की अनिवार्यता नहीं है।
   - शिकायत दर्ज करने की समय सीमा: घटना के 2 वर्ष के भीतर।

2. **फसल बीमा (PMFBY - प्रधानमंत्री फसल बीमा योजना):**
   - प्राकृतिक आपदा या स्थानीय नुकसान की स्थिति में **72 घंटे के भीतर** अपने संबंधित बैंक, बीमा कंपनी या पोर्टल पर सूचित करना अनिवार्य है।

3. **मुफ्त कानूनी सहायता (NALSA - धारा 12):**
   - महिलाएं, बच्चे, SC/ST समुदाय, दिव्यांगजन और जिनकी वार्षिक आय 1 लाख रुपये से कम है, वे जिला विधिक सेवा प्राधिकरण (DLSA) से मुफ्त वकील प्राप्त कर सकते हैं (हेल्पलाइन: 15100)।

4. **बिल्डर व फ्लैट विवाद (RERA):**
   - निर्माण या पजेशन में देरी के लिए राज्य रेरा (RERA) प्राधिकरण में धारा 18 के तहत ब्याज व रिफंड की मांग की जा सकती है।

---
⚠️ यह केवल सामान्य कानूनी जानकारी और नागरिक जागरूकता के लिए है, कोई औपचारिक कानूनी सलाह नहीं।`;

const ENGLISH_FALLBACK = `Thank you for reaching out to CaseKeeper Legal Assistant.

Here is a summary of key Indian statutory rights relevant to your enquiry:

1. **Consumer Protection (Consumer Protection Act, 2019):**
   - File complaints online via the e-Jagriti & e-Daakhil portals (edaakhil.nic.in) or at the District Commission.
   - No mandatory advocate representation required for claims up to ₹50 Lakhs.
   - Limitation period: 2 years from cause of action (Section 69).

2. **Crop Insurance (PMFBY):**
   - Crop loss due to localized calamity must be reported within **72 hours** to your bank or the PMFBY portal.

3. **Free Legal Aid (NALSA Section 12):**
   - Eligible citizens (income ≤ ₹1 Lakh, women, children, SC/ST, custodial detainees) can avail free representation via DLSA (Helpline: 15100).

4. **Property & RERA:**
   - File claims for delayed possession or compensation under Section 18 of the RERA Act 2016.

---
⚠️ This is general statutory information for civic awareness only and does not constitute formal legal advice or advocate representation.`;

export async function POST(req: Request) {
  try {
    const { message, language = 'en' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    // Detect language: if language is explicitly 'hi' or if message contains Hindi/Devanagari characters
    const hasHindiChars = /[\u0900-\u097F]/.test(message);
    const targetLang = (language.toLowerCase() === 'hi' || hasHindiChars) ? 'hi' : 'en';

    // Filter relevant approved public sources for grounding
    const relevantSources = DEMO_RESOURCES.slice(0, 3).map(r => ({
      title: r.title,
      authority: r.authority,
      url: r.url,
      citation: `${r.category} (${r.type})`
    }));

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === 'your-groq-api-key') {
      return NextResponse.json({
        answer: targetLang === 'hi' ? HINDI_FALLBACK : ENGLISH_FALLBACK,
        sources: relevantSources,
        model: 'casekeeper-statutory-engine',
        isDemoMode: true
      });
    }

    const groq = new Groq({ apiKey });
    const systemPrompt = buildSystemPrompt(targetLang);

    const sourcesContext = relevantSources
      .map(s => `- ${s.title} (${s.authority}): ${s.citation}`)
      .join('\n');

    const userPrompt = `Statutory Sources:\n${sourcesContext}\n\nCitizen Query:\n${message}\n\nPlease respond in ${targetLang === 'hi' ? 'Hindi (हिंदी)' : 'English'}.`;

    let answer = '';
    let usedModel = 'meta-models/muse-spark-open';

    // Priority 1: User's requested model
    try {
      const completion = await groq.chat.completions.create({
        model: 'meta-models/muse-spark-open',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1024
      });
      answer = completion.choices?.[0]?.message?.content ?? '';
    } catch (e1: any) {
      // Priority 2: High-capacity 120B model on the user's Groq account
      try {
        usedModel = 'openai/gpt-oss-120b';
        const completion = await groq.chat.completions.create({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 1024
        });
        answer = completion.choices?.[0]?.message?.content ?? '';
      } catch (e2: any) {
        // Priority 3: Fast 27B model on the user's Groq account
        try {
          usedModel = 'qwen/qwen3.8-27b';
          const completion = await groq.chat.completions.create({
            model: 'qwen/qwen3.8-27b',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1024
          });
          answer = completion.choices?.[0]?.message?.content ?? '';
        } catch (e3: any) {
          console.error('All Groq model attempts failed:', e3);
          answer = targetLang === 'hi' ? HINDI_FALLBACK : ENGLISH_FALLBACK;
          usedModel = 'casekeeper-statutory-engine';
        }
      }
    }

    if (!answer || answer.trim().length === 0) {
      answer = targetLang === 'hi' ? HINDI_FALLBACK : ENGLISH_FALLBACK;
    }

    return NextResponse.json({
      answer,
      sources: relevantSources,
      model: usedModel,
      language: targetLang,
      isStatutoryGuidance: true
    });
  } catch (error: any) {
    console.error('Chat processing error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your legal enquiry. Please try again.' },
      { status: 500 }
    );
  }
}
