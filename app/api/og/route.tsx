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
          }}
        >
          {/* Ethereum logo in the background */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: '0.1',
              width: '400px',
              height: '400px',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 784.37 1277.39"
              fill="#ffffff"
            >
              <g>
                <polygon points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"/>
                <polygon points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"/>
                <polygon points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"/>
                <polygon points="392.07,1277.38 392.07,956.52 -0,724.89"/>
              </g>
            </svg>
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