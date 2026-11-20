import { NextResponse } from 'next/server';

// Server-side route handler for Sarvam AI Speech-to-Text (PRD Section 4.4, 7)
// Converts Hindi or English audio inputs into text before submission.
export async function POST(req: Request) {
  try {
    const { language = 'hi-IN', audioBase64 } = await req.json();

    const sarvamApiKey = process.env.SARVAM_API_KEY;

    // Deterministic fallback if API key is not configured
    if (!sarvamApiKey || sarvamApiKey === 'your-sarvam-api-key') {
      const demoTranscript = language.startsWith('hi')
        ? 'उपभोक्ता फोरम में ई-कॉमर्स विक्रेता के खिलाफ शिकायत दर्ज करने की प्रक्रिया क्या है?'
        : 'What is the procedure to file a consumer complaint against an e-commerce seller?';

      return NextResponse.json({
        transcript: demoTranscript,
        confidence: 0.96,
        languageCode: language,
        isSimulated: true
      });
    }

    // Call Sarvam AI STT Endpoint
    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': sarvamApiKey
      },
      body: JSON.stringify({
        audio: audioBase64,
        language_code: language,
        model: 'saaras:v1'
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Speech-to-text processing failed. Please try again or type your query.' }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({
      transcript: data.transcript,
      confidence: data.confidence || 0.95,
      languageCode: language,
      isSimulated: false
    });
  } catch (error: any) {
    console.error('STT error:', error);
    return NextResponse.json(
      { error: 'An error occurred during audio processing.' },
      { status: 500 }
    );
  }
}
