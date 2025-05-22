import React from 'react';

interface ExplanationModeProps {
  eipNumber: string;
  onModeSelect: (mode: 'simple' | 'detailed' | 'technical') => void;
  onBack: () => void;
}

export function ExplanationMode({ eipNumber, onModeSelect, onBack }: ExplanationModeProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← Back
        </button>
        <h2 className="text-lg font-semibold">Choose Explanation Type</h2>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => onModeSelect('simple')}
          className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
        >
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">Simple Explanation</h3>
          <p className="text-sm text-gray-600">Easy to understand overview for non-technical readers</p>
        </button>

        <button
          onClick={() => onModeSelect('detailed')}
          className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
        >
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">Detailed Explanation</h3>
          <p className="text-sm text-gray-600">Comprehensive overview with context and implications</p>
        </button>

        <button
          onClick={() => onModeSelect('technical')}
          className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
        >
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">Technical Explanation</h3>
          <p className="text-sm text-gray-600">In-depth technical details and implementation specifics</p>
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        Explaining EIP-{eipNumber}
      </div>
    </div>
  );
} 