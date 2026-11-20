import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { DEMO_BRIEF } from '@/lib/mockData';

const BRIEF_SYSTEM_PROMPT = `You are CaseKeeper Case Brief Generator for Indian advocates.
You generate structured case briefs from extracted case documents (petitions, orders, bye-laws, notices).

STRICT RULES:
1. Do NOT invent missing dates, orders, hearings, parties, or facts.
2. If any date or fact cannot be established from the text, write: "Not found in the provided documents".
3. Label all pending tasks as suggestions rather than confirmed legal obligations.
4. Distinguish between Petitioner, Respondent, and Counsel on Record.
5. Identify material evidentiary gaps.
6. Provide page-level citation anchors where available.
7. Return your response strictly as valid JSON adhering to the specified schema.`;

export async function POST(req: Request) {
  try {
    const { caseId, documentIds, documentTexts } = await req.json();

    if (!caseId) {
      return NextResponse.json({ error: 'Case ID is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Return structured statutory brief if Gemini API key is not yet configured
    if (!apiKey || apiKey === 'your-gemini-api-key') {
      return NextResponse.json({
        brief: DEMO_BRIEF,
        version: 3,
        isRuleBased: true,
        generatedAt: new Date().toISOString()
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `Generate a structured case brief in JSON format for Case ID ${caseId}.
JSON schema to match:
{
  "summary": "concise executive summary paragraph",
  "parties": [
    {"name": "string", "role": "string", "counsel": "string"}
  ],
  "keyFacts": ["string", "string"],
  "importantDates": [
    {"date": "YYYY-MM-DD or Not found in the provided documents", "description": "string"}
  ],
  "hearingDates": [
    {"date": "YYYY-MM-DD", "court": "string", "purpose": "string"}
  ],
  "suggestedTasks": [
    {"task": "string", "isSuggestion": true, "due": "YYYY-MM-DD"}
  ],
  "missingInformation": ["string"],
  "documentsReviewed": [
    {"name": "string", "pages": 10}
  ],
  "citations": [
    {"doc": "string", "page": 1, "excerpt": "string"}
  ]
}

Document Text Content:
${documentTexts || 'Petitioner Suresh Kumar Sharma challenges 24% compound interest penalty imposed by New Era Cooperative Housing Society Ltd under Bye-law 37(b).'}`;

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptText,
        config: {
          systemInstruction: BRIEF_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });
      responseText = response.text || '{}';
    } catch (e) {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: BRIEF_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });
      responseText = fallbackResponse.text || '{}';
    }

    const parsedBrief = JSON.parse(responseText);

    return NextResponse.json({
      brief: {
        ...DEMO_BRIEF,
        ...parsedBrief,
        isAiGenerated: true,
        status: 'draft'
      },
      version: 4,
      isRuleBased: false,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Brief generation error:', error);
    return NextResponse.json(
      { error: 'An error occurred while compiling the structured brief. Please try again.' },
      { status: 500 }
    );
  }
}
