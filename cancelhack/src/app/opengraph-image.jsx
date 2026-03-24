import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'cancelhack_ — Get the discount. Keep the service.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#faf7f2',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent strip at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, rgba(16,185,129,0.4), #10b981, rgba(16,185,129,0.4))',
          }}
        />

        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle, rgba(45,42,38,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            color: '#2d2a26',
            marginBottom: 32,
          }}
        >
          cancelhack
          <span style={{ color: '#10b981' }}>_</span>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            fontFamily: 'monospace',
            fontWeight: 700,
            color: '#2d2a26',
            fontSize: 72,
            lineHeight: 1.1,
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          <span>Get the discount.</span>
          <span>Keep the service.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: '#8a8580',
            textAlign: 'center',
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          Hidden retention offers on 69+ subscription services.
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 40,
            fontFamily: 'monospace',
            fontSize: 18,
            color: '#a8a29e',
            letterSpacing: '0.02em',
          }}
        >
          no sign-up. no bs. just discounts.
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            color: '#a8a29e',
          }}
        >
          <span>cancelhack.co</span>
          <span style={{ color: '#d4d0cc' }}>·</span>
          <span>built by yoshizen.co</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
