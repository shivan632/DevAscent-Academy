import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DevAscent Verified Engineering Portfolio';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ username: string }>;
}

function cleanHandle(raw: string): string {
  if (!raw) return '';
  try {
    const decoded = decodeURIComponent(raw);
    return decoded.replace(/^%40/i, '').replace(/^@/, '').toLowerCase().trim();
  } catch {
    return raw.replace(/^%40/i, '').replace(/^@/, '').toLowerCase().trim();
  }
}

export default async function Image({ params }: Props) {
  const { username } = await params;
  const handle = cleanHandle(username);

  let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devascent-academy.onrender.com/api/v1';
  backendUrl = backendUrl.replace(/\/+$/, '');
  if (!backendUrl.endsWith('/api/v1') && !backendUrl.endsWith('/api')) {
    backendUrl = `${backendUrl}/api/v1`;
  }

  let user: any = null;
  try {
    const res = await fetch(`${backendUrl}/portfolio/public/${encodeURIComponent(handle)}`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const json = await res.json();
      user = json?.data?.user || json?.user || null;
    }
  } catch {}

  const displayName = user?.name || handle || 'DevAscent Scholar';
  const headline =
    user?.headline ||
    (user?.college ? `${user?.degree ? `${user.degree} • ` : ''}${user.college}` : 'Software Engineering Scholar');
  const skills: string[] = Array.isArray(user?.skills) ? user.skills.slice(0, 5) : ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL'];
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#070913',
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.18) 0%, transparent 50%)',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: '900',
              }}
            >
              ▲
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                DevAscent Academy
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Verified Proof-of-Work Ledger
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            <span>●</span>
            <span>VERIFIED ENGINEER PROFILE</span>
          </div>
        </div>

        {/* Center: Identity & Headline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '32px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '54px',
              fontWeight: '900',
              color: '#ffffff',
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.35)',
              border: '3px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {avatarLetter}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '850px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '46px', fontWeight: '900', letterSpacing: '-1px' }}>
                {displayName}
              </span>
              <span
                style={{
                  fontSize: '18px',
                  color: '#818cf8',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontFamily: 'monospace',
                }}
              >
                @{handle}
              </span>
            </div>

            <span style={{ fontSize: '20px', color: '#cbd5e1', lineHeight: '1.4' }}>
              {headline}
            </span>
          </div>
        </div>

        {/* Bottom: Stack & Trust Guarantee */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Stack:
            </span>
            {skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#a5b4fc',
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          <span style={{ fontSize: '14px', color: '#64748b', fontFamily: 'monospace' }}>
            devascentacademy.me/@{handle}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

