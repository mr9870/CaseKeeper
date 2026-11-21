import zlib from 'zlib';

/**
 * Pure Node.js zero-dependency PDF text extractor.
 * Uses built-in zlib to decompress PDF FlateDecode streams
 * and parses text operators (Tj / TJ / strings).
 * 100% serverless compatible (Antideploy, Vercel, Node.js).
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const content = buffer.toString('latin1');
  const extractedParts: string[] = [];

  try {
    // 1. Search for PDF object streams
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;

    while ((match = streamRegex.exec(content)) !== null) {
      const rawStream = match[1];
      let decompressed = '';

      try {
        const streamBuffer = Buffer.from(rawStream, 'latin1');
        decompressed = zlib.inflateSync(streamBuffer).toString('latin1');
      } catch {
        // Stream may not be flate-compressed
        decompressed = rawStream;
      }

      // Extract text from (text) Tj
      const tjMatches = decompressed.match(/\((.*?)\)\s*Tj/g);
      if (tjMatches) {
        for (const m of tjMatches) {
          const text = m.replace(/^\(|\)\s*Tj$/g, '').trim();
          if (text.length > 0 && !text.startsWith('%')) {
            extractedParts.push(text);
          }
        }
      }

      // Extract text from [(t)(e)(x)(t)] TJ arrays
      const tjArrayMatches = decompressed.match(/\[([\s\S]*?)\]\s*TJ/g);
      if (tjArrayMatches) {
        for (const arr of tjArrayMatches) {
          const parts = arr.match(/\((.*?)\)/g);
          if (parts) {
            const line = parts.map(p => p.replace(/^\(|\)$/g, '')).join('');
            if (line.trim().length > 0) {
              extractedParts.push(line.trim());
            }
          }
        }
      }

      // Extract hex strings: <48656c6c6f> Tj
      const hexMatches = decompressed.match(/<([0-9a-fA-F]+)>\s*Tj/g);
      if (hexMatches) {
        for (const h of hexMatches) {
          const hex = h.replace(/^<|>\s*Tj$/g, '');
          try {
            const decoded = Buffer.from(hex, 'hex').toString('latin1');
            if (decoded.trim().length > 1) {
              extractedParts.push(decoded.trim());
            }
          } catch {}
        }
      }
    }
  } catch (streamErr) {
    console.warn('Stream extraction warning:', streamErr);
  }

  // 2. If streams extracted text, format and return
  if (extractedParts.length > 5) {
    const rawText = extractedParts.join(' ');
    // Clean escape characters
    return rawText
      .replace(/\\([()\\])/g, '$1')
      .replace(/[ \t]+/g, ' ')
      .replace(/\s{2,}/g, '\n')
      .trim();
  }

  // 3. Fallback: Extract readable printable ASCII/Latin-1 words from PDF binary
  try {
    const cleanChars = content.replace(/[^\x20-\x7E\n]/g, ' ');
    const readableBlocks = cleanChars
      .split(/\s{3,}/)
      .map(s => s.trim())
      .filter(s => s.length > 25 && /[a-zA-Z]{3,}/.test(s));

    if (readableBlocks.length > 0) {
      return readableBlocks.join('\n\n');
    }
  } catch (fallbackErr) {
    console.error('Binary stream fallback error:', fallbackErr);
  }

  return '';
}
