"use client";

import { useState, useCallback } from "react";
import { ExplanationMode } from "./components/ExplanationMode";
import { ExplanationView } from './components/ExplanationView';

type ViewState = 'input' | 'mode-select' | 'explanation';

export default function App() {
  const [eipNumber, setEipNumber] = useState("");
  const [error, setError] = useState("");
  const [viewState, setViewState] = useState<ViewState>('input');
  const [selectedMode, setSelectedMode] = useState<'simple' | 'detailed' | 'technical'>('simple');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eipNumber) {
      setError("Please enter an EIP number");
      return;
    }
    const num = parseInt(eipNumber);
    if (isNaN(num) || num < 1) {
      setError("Please enter a valid EIP number");
      return;
    }
    setError("");
    setViewState('mode-select');
  }, [eipNumber]);

  const handleModeSelect = useCallback((mode: 'simple' | 'detailed' | 'technical') => {
    setSelectedMode(mode);
    setViewState('explanation');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EIP Explainer</h1>
          <p className="text-gray-600">Understand Ethereum Improvement Proposals in simple terms</p>
        </header>

        <main className="bg-white rounded-lg shadow-lg p-6">
          {viewState === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="eip-number" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter EIP Number
                </label>
                <input
                  id="eip-number"
                  type="number"
                  value={eipNumber}
                  onChange={(e) => setEipNumber(e.target.value)}
                  placeholder="e.g. 1559"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Learn About This EIP
              </button>
            </form>
          )}

          {viewState === 'mode-select' && (
            <ExplanationMode
              eipNumber={eipNumber}
              onModeSelect={handleModeSelect}
              onBack={() => setViewState('input')}
            />
          )}

          {viewState === 'explanation' && (
            <ExplanationView
              eipNumber={eipNumber}
              mode={selectedMode}
              onBack={() => setViewState('mode-select')}
            />
          )}
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">
          Built with Next.js and Frame
        </footer>
      </div>
    </div>
  );
}
