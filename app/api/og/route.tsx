import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text') || 'EIP Explainer';

    // Split text into chunks of roughly 50 characters
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).length > 50) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #1a1a1a, #2d1c4f)',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background container */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: '0.15',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://eip-explain.vercel.app/images/ethereum-logo.png"
              alt="Ethereum Logo"
              style={{
                width: '800px',
                height: '800px',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 1,
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '40px',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Main text */}
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: '56px',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'white',
                  marginTop: '10px',
                  padding: '0 20px',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Understand Ethereum Improvement Proposals
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err: unknown) {
    console.error(`Failed to generate image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
} 