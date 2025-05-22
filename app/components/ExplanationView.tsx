import { useEffect, useState } from 'react';

interface ExplanationViewProps {
  eipNumber: string;
  mode: 'simple' | 'detailed' | 'technical';
  onBack: () => void;
}

export function ExplanationView({ eipNumber, mode, onBack }: ExplanationViewProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExplanation() {
      try {
        // First, fetch the EIP content
        const eipResponse = await fetch(`https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNumber}.md`);
        let eipContent;
        
        if (eipResponse.ok) {
          eipContent = await eipResponse.text();
        } else {
          // Fallback to ethereum.org
          const fallbackResponse = await fetch(`https://eips.ethereum.org/EIPS/eip-${eipNumber}`);
          if (!fallbackResponse.ok) {
            throw new Error('EIP not found');
          }
          const html = await fallbackResponse.text();
          // Extract content from the HTML
          const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
          eipContent = match ? match[1].replace(/<[^>]*>/g, '') : html;
        }

        // Now request the explanation with the EIP content
        const response = await fetch('/api/frame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            untrustedData: {
              buttonIndex: mode === 'simple' ? 1 : mode === 'detailed' ? 2 : 3,
              state: {
                page: 'mode-select',
                eip: eipNumber,
                content: eipContent
              }
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch explanation');
        }

        const data = await response.text();
        // Extract the description from the meta tag
        const descriptionMatch = data.match(/og:description" content="([^"]+)"/);
        const explanation = descriptionMatch ? descriptionMatch[1] : 'No explanation available';
        setExplanation(explanation);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load explanation');
      } finally {
        setLoading(false);
      }
    }

    fetchExplanation();
  }, [eipNumber, mode]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← Back
        </button>
        <h2 className="text-lg font-semibold">EIP-{eipNumber} Explanation ({mode})</h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-4">
            {error}
          </div>
        ) : (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
} 