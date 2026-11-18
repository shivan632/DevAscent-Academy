import { NextRequest, NextResponse } from 'next/server';
import { evaluateResume } from '@/lib/atsEngine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resumeText = body.resume_text || '';
    const targetRole = body.target_role || 'aiml';

    if (!resumeText || resumeText.trim().length < 20) {
      return NextResponse.json(
        { success: false, detail: 'Please provide at least 20 characters of resume content to evaluate.' },
        { status: 400 }
      );
    }

    // 1. Try forwarding to Python ATS Engine (Local or Remote) with graceful fallback
    const pythonUrl = process.env.NEXT_PUBLIC_ATS_API_URL || 'http://127.0.0.1:8000';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const upstreamRes = await fetch(`${pythonUrl.replace(/\/$/, '')}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, target_role: targetRole }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (upstreamRes.ok) {
        const json = await upstreamRes.json();
        if (json.success && json.data) {
          // Augment with rich RAG structured sections if not already provided
          const tsResult = evaluateResume(resumeText, targetRole);
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
      // Python service offline or timed out; fall back seamlessly to built-in TypeScript engine
    }

    // 2. Evaluate with Built-in TypeScript Engine
    const result = evaluateResume(resumeText, targetRole);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error('[ATS Score Error]', err);
    return NextResponse.json(
      { success: false, detail: err.message || 'ATS evaluation failed.' },
      { status: 500 }
    );
  }
}
