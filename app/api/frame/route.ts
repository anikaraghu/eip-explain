import { NextRequest } from 'next/server';
import { generateEIPSummary } from '../utils/generateSummary';

// Types for Frame request
type FrameRequest = {
  untrustedData: {
    buttonIndex?: number;
    inputText?: string;
    state?: {
      page?: string;
      eip?: string;
      content?: string;
    };
  };
};

function getFrameHtmlResponse({
  title,
  description,
  buttons,
  image,
  inputText,
  state
}: {
  title?: string;
  description?: string;
  buttons?: Array<{ label: string; action?: 'post' | 'link' | 'mint' | 'input' }>;
  image?: { url: string; aspectRatio?: '1.91:1' | '1:1' };
  inputText?: string;
  state?: any;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  
  // If no image is provided, create a default one with the title/description
  const defaultImageUrl = `${baseUrl}/api/og?text=${encodeURIComponent(description || title || 'EIP Explainer')}`;
  
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${image?.url || defaultImageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="${image?.aspectRatio || '1.91:1'}" />
        <meta property="og:title" content="${title || 'EIP Explainer'}" />
        <meta property="og:description" content="${description || 'Explain Ethereum Improvement Proposals'}" />
        ${buttons?.map((button, i) => 
          `<meta property="fc:frame:button:${i + 1}" content="${button.label}" />${button.action ? `<meta property="fc:frame:button:${i + 1}:action" content="${button.action}" />` : ''}`
        ).join('\n')}
        ${inputText ? `<meta property="fc:frame:input:text" content="${inputText}" />` : ''}
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
        ${state ? `<meta property="fc:frame:state" content="${JSON.stringify(state)}" />` : ''}
      </head>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request:', body);

    const { buttonIndex, inputText } = body.untrustedData;
    const state = body.untrustedData.state;

    // Initial state - show EIP input prompt
    if (!state?.page || state.page === 'input') {
      return getFrameHtmlResponse({
        title: 'EIP Explainer',
        description: 'Enter an EIP number to learn more about it',
        buttons: [{ label: 'Enter EIP Number', action: 'input' }],
        inputText: 'Enter EIP number (e.g. 1559)',
        state: { page: 'input' }
      });
    }

    // Handle EIP number input
    if (state.page === 'input' && inputText) {
      const eipNumber = inputText.trim();
      console.log('Fetching EIP data for:', eipNumber);
      
      try {
        // First try GitHub
        const response = await fetch(`https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNumber}.md`);
        let eipContent;
        
        if (response.ok) {
          eipContent = await response.text();
        } else {
          // Fallback to ethereum.org
          const fallbackResponse = await fetch(`https://eips.ethereum.org/EIPS/eip-${eipNumber}`);
          if (!fallbackResponse.ok) {
            throw new Error('EIP not found');
          }
          const html = await fallbackResponse.text();
          const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
          eipContent = match ? match[1].replace(/<[^>]*>/g, '') : html;
        }

        // Show explanation mode options
        return getFrameHtmlResponse({
          title: `EIP-${eipNumber}`,
          description: 'Choose how you would like this EIP explained:',
          buttons: [
            { label: 'Simple' },
            { label: 'Detailed' },
            { label: 'Technical' }
          ],
          state: {
            page: 'mode-select',
            eip: eipNumber,
            content: eipContent
          }
        });
      } catch (error) {
        return getFrameHtmlResponse({
          title: 'Error',
          description: 'EIP not found. Please try again with a valid EIP number.',
          buttons: [{ label: 'Try Again' }],
          state: { page: 'input' }
        });
      }
    }

    // Handle mode selection and show summary
    if (state.page === 'mode-select' && buttonIndex && state.content) {
      const mode = ['simple', 'detailed', 'technical'][buttonIndex - 1] as 'simple' | 'detailed' | 'technical';
      console.log('Generating summary for mode:', mode);
      
      try {
        const summary = await generateEIPSummary(state.content, mode);
        console.log('Summary generated successfully');

        return getFrameHtmlResponse({
          title: `EIP-${state.eip} (${mode})`,
          description: summary,
          buttons: [{ label: 'Try Another EIP' }],
          state: { page: 'input' }
        });
      } catch (error) {
        console.error('Error generating summary:', error);
        return getFrameHtmlResponse({
          title: 'Error',
          description: 'Failed to generate summary. Please try again.',
          buttons: [{ label: 'Try Again' }],
          state: { page: 'input' }
        });
      }
    }

    return getFrameHtmlResponse({
      title: 'Error',
      description: 'Invalid state. Please start over.',
      buttons: [{ label: 'Start Over' }],
      state: { page: 'input' }
    });
  } catch (error) {
    console.error('Unexpected error in frame route:', error);
    return getFrameHtmlResponse({
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
      buttons: [{ label: 'Start Over' }],
      state: { page: 'input' }
    });
  }
}

export const GET = POST; 