/**
 * Node.js PDF text extractor using pdf-parse
 */

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfModule = await import('pdf-parse');
    const PDFParse = (pdfModule as any).PDFParse || (pdfModule as any).default || pdfModule;
    
    if (typeof PDFParse === 'function') {
      try {
        const parser = new PDFParse({ data: buffer });
        if (typeof parser.load === 'function') {
          await parser.load();
          const textResult = await parser.getText();
          if (parser.destroy) await parser.destroy();
          if (textResult && typeof textResult === 'string' && textResult.length > 20) {
            return textResult;
          }
          if (textResult?.text && textResult.text.length > 20) {
            return textResult.text;
          }
        }
      } catch (classErr) {
        // Fallback for function-style pdf-parse (v1.1)
        const parsed = await PDFParse(buffer);
        if (parsed?.text && parsed.text.length > 20) {
          return parsed.text;
        }
      }
    }
  } catch (err) {
    console.warn('pdf-parse loader warning, using regex text-stream fallback:', err);
  }

  // Pure binary/latin-1 regex stream fallback (works without any external libraries)
  try {
    const raw = buffer.toString('latin1');
    const textBlocks: string[] = [];
    
    // Match PDF text strings: (Text here) Tj or [(T)(e)(x)(t)] TJ
    const tjMatches = raw.match(/\((.*?)\)\s*Tj/g);
    if (tjMatches && tjMatches.length > 5) {
      tjMatches.forEach(m => {
        const cleaned = m.replace(/^\(|\)\s*Tj$/g, '').trim();
        if (cleaned.length > 0) textBlocks.push(cleaned);
      });
      return textBlocks.join(' ');
    }
    
    // Match plain printable characters
    const cleanChars = raw.replace(/[^\x20-\x7E\n]/g, ' ');
    const readableBlocks = cleanChars
      .split(/\s{3,}/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && /[a-zA-Z]{3,}/.test(s));
      
    if (readableBlocks.length > 0) {
      return readableBlocks.join('\n\n');
    }
  } catch (fallbackErr) {
    console.error('Binary stream extraction failed:', fallbackErr);
  }

  return '';
}
