import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text') || 'EIP Explainer';

    // Split text into chunks of roughly 50 characters
    const words = text.split(' ');
    let lines = [];
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
            backgroundColor: '#030303',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: '60px',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'white',
                  marginTop: '20px',
                  padding: '0 20px',
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(`Failed to generate image: ${e.message}`);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
} 