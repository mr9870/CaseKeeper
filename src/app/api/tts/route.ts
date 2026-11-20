import { NextResponse } from 'next/server';

// Server-side route handler for Sarvam AI Text-to-Speech (PRD Section 4.4, 7)
// Generates natural Hindi or Indian English voice playback for legal guidance answers.
export async function POST(req: Request) {
  try {
    const { text, language = 'hi-IN' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required for TTS synthesis.' }, { status: 400 });
    }

    const sarvamApiKey = process.env.SARVAM_API_KEY;

    // Deterministic fallback if API key is not configured
    if (!sarvamApiKey || sarvamApiKey === 'your-sarvam-api-key') {
      return NextResponse.json({
        audioUrl: '/audio/demo_response.mp3',
        format: 'audio/mpeg',
        durationSec: 14.5,
        isSimulated: true,
        message: 'Synthesized voice stream ready for playback.'
      });
    }

    // Call Sarvam AI TTS Endpoint
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': sarvamApiKey
      },
      body: JSON.stringify({
        inputs: [text.slice(0, 500)],
        target_language_code: language,
        speaker: 'meera',
        pace: 1.0,
        model: 'bulbul:v1'
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Text-to-speech synthesis failed. Please try again.' }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({
      audioBase64: data.audios?.[0],
      format: 'audio/wav',
      isSimulated: false
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'An error occurred during audio generation.' },
      { status: 500 }
    );
  }
}
