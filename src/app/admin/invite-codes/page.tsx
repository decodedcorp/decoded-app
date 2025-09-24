'use client';

import { useState, useEffect } from 'react';
import { getAllValidCodes, getValidCodesCount } from '@/lib/invite/validation';

export default function InviteCodesAdminPage() {
  const [codes, setCodes] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const validCodes = getAllValidCodes();
    setCodes(validCodes);
    setCount(getValidCodesCount());
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAllCodes = () => {
    const codesText = codes.join('\n');
    copyToClipboard(codesText);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#EAFD66] mb-2">Invite Codes Admin</h1>
          <p className="text-zinc-400">
            Total valid codes: <span className="text-[#EAFD66] font-mono">{count}</span>
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={copyAllCodes}
            className="bg-[#EAFD66] text-[#111111] px-4 py-2 rounded-lg font-medium hover:bg-[#F2FF7A] transition-colors"
          >
            Copy All Codes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {codes.map((code, index) => (
            <div
              key={code}
              className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-[#EAFD66]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-lg text-[#EAFD66]">{code}</div>
                  <div className="text-sm text-zinc-400">#{index + 1}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="text-zinc-400 hover:text-[#EAFD66] transition-colors"
                  title="Copy code"
                >
                  📋
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-[#EAFD66]">Usage Instructions</h3>
          <ul className="text-sm text-zinc-300 space-y-1">
            <li>• Users can enter any of these codes to access the app</li>
            <li>• Codes are case-insensitive (DECODED2024 = decoded2024)</li>
            <li>• Codes are stored in localStorage after successful validation</li>
            <li>• To add/remove codes, update the GENERATED_CODES array in validation.ts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
