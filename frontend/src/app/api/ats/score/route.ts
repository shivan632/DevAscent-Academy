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

    // 1. If upstream Python service URL is configured, try forwarding
    const pythonUrl = process.env.NEXT_PUBLIC_ATS_API_URL;
    if (pythonUrl && !pythonUrl.includes('localhost') && !pythonUrl.includes('127.0.0.1')) {
      try {
        const upstreamRes = await fetch(`${pythonUrl.replace(/\/$/, '')}/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume_text: resumeText, target_role: targetRole }),
        });

        if (upstreamRes.ok) {
          const json = await upstreamRes.json();
          return NextResponse.json(json);
        }
      } catch (upstreamErr) {
        console.warn('[ATS Proxy] Upstream Python service unreachable, falling back to built-in engine:', upstreamErr);
      }
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
