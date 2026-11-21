import { NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Case 1: File Upload (multipart/form-data)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
      }

      // Forward to Python Offline NLP Backend
      try {
        const pyFormData = new FormData();
        pyFormData.append('file', file, file.name);

        const pyRes = await fetch(`${PYTHON_BACKEND_URL}/api/extract/upload`, {
          method: 'POST',
          body: pyFormData
        });

        if (pyRes.ok) {
          const pyData = await pyRes.json();
          return NextResponse.json(pyData);
        } else {
          const errDetail = await pyRes.text();
          console.warn('Python backend error:', errDetail);
        }
      } catch (pyErr) {
        console.warn('Could not connect to Python backend on port 8000:', pyErr);
      }

      // Fallback if Python backend is offline: extract plain text if .txt
      let extractedText = '';
      if (file.name.endsWith('.txt')) {
        extractedText = await file.text();
      }

      return NextResponse.json({
        success: true,
        data: {
          filename: file.name,
          summary: extractedText ? extractedText.slice(0, 300) : `Document ${file.name} received. Start Python backend on port 8000 for deep PDF extraction.`,
          parties: {
            petitioner: 'Aggrieved Party',
            respondent: 'Opposing Party',
            counsels: [],
            all_detected_names: []
          },
          dates: [],
          statutes: [],
          sections: [],
          monetary_amounts: [],
          dispute_categories: [],
          engine: 'Next.js Fallback Receiver'
        }
      });
    }

    // Case 2: JSON Payload (Raw text or Document ID)
    const body = await req.json();
    const { text, filename } = body;

    if (text) {
      try {
        const pyRes = await fetch(`${PYTHON_BACKEND_URL}/api/extract/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, filename: filename || 'document.txt' })
        });
        if (pyRes.ok) {
          const pyData = await pyRes.json();
          return NextResponse.json(pyData);
        }
      } catch (pyErr) {
        console.warn('Python backend text extraction unreachable:', pyErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        filename: filename || 'document.txt',
        summary: text ? text.slice(0, 300) : 'No text provided.',
        parties: { petitioner: 'Petitioner', respondent: 'Respondent', counsels: [] },
        dates: [],
        statutes: [],
        sections: [],
        monetary_amounts: []
      }
    });

  } catch (error: any) {
    console.error('Extraction API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the document: ' + (error?.message || '') },
      { status: 500 }
    );
  }
}
