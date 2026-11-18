import { NextRequest, NextResponse } from 'next/server';
import { evaluateResume } from '@/lib/atsEngine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetRole = (formData.get('target_role') as string) || 'aiml';

    if (!file) {
      return NextResponse.json(
        { success: false, detail: 'No resume file uploaded.' },
        { status: 400 }
      );
    }

    const filename = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = '';

    // 1. If Python service is available (local or remote), try forwarding with timeout
    const pythonUrl = process.env.NEXT_PUBLIC_ATS_API_URL || 'http://127.0.0.1:8000';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const forwardForm = new FormData();
      forwardForm.append('file', file);
      forwardForm.append('target_role', targetRole);

      const upstreamRes = await fetch(`${pythonUrl.replace(/\/$/, '')}/upload`, {
        method: 'POST',
        body: forwardForm,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (upstreamRes.ok) {
        const json = await upstreamRes.json();
        if (json.success && json.data) {
          // Augment with rich RAG structured sections if not already provided
          const rawPreview = json.extracted_text_preview || '';
          const tsResult = evaluateResume(rawPreview, targetRole);
          if (!json.data.parsed_sections) {
            json.data.parsed_sections = tsResult.parsed_sections;
          }
          if (!json.data.optimized_sections) {
            json.data.optimized_sections = tsResult.optimized_sections;
          }
          if (!json.data.deductions) {
            json.data.deductions = tsResult.deductions;
          }
          if (typeof json.data.parse_rate !== 'number') {
            json.data.parse_rate = tsResult.parse_rate;
            json.data.parse_rate_missed = tsResult.parse_rate_missed;
            json.data.parse_rate_reason = tsResult.parse_rate_reason;
          }
          return NextResponse.json(json);
        }
      }
    } catch {
      // Python service offline or timed out; fall back seamlessly to native serverless extraction
    }

    // 2. High-Fidelity PDF & DOCX Native Extraction
    if (filename.endsWith('.pdf')) {
      try {
        const { extractText } = await import('unpdf');
        const uint8 = new Uint8Array(buffer);
        const unpdfRes = await extractText(uint8);
        if (Array.isArray(unpdfRes.text)) {
          extractedText = unpdfRes.text.join('\n\n');
        } else {
          extractedText = unpdfRes.text || '';
        }
      } catch (unpdfErr) {
        console.warn('[ATS Parse] unpdf extraction error:', unpdfErr);
      }
    } else if (filename.endsWith('.docx')) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mammoth = require('mammoth');
        const docResult = await mammoth.extractRawText({ buffer });
        extractedText = docResult.value || '';
      } catch (docxErr) {
        console.warn('[ATS Parse] mammoth docx extraction error:', docxErr);
        extractedText = buffer.toString('utf-8');
      }
    } else {
      // .txt or generic text format
      extractedText = buffer.toString('utf-8');
    }

    // Sanitize extracted text: strip non-printable binary bytes and control codes
    extractedText = extractedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ').trim();

    if (!extractedText || extractedText.length < 20) {
      return NextResponse.json(
        {
          success: false,
          detail: 'Could not extract readable text from the document. Please ensure the PDF has selectable text and is not a scanned image.',
        },
        { status: 400 }
      );
    }

    // 3. Run Built-in Calibrated Diagnostic
    const result = evaluateResume(extractedText, targetRole);

    return NextResponse.json({
      success: true,
      filename: file.name,
      extracted_text_preview: extractedText.slice(0, 300) + (extractedText.length > 300 ? '...' : ''),
      data: result,
    });
  } catch (err: any) {
    console.error('[ATS Upload Error]', err);
    return NextResponse.json(
      { success: false, detail: err.message || 'ATS document parsing failed.' },
      { status: 500 }
    );
  }
}
