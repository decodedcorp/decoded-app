'use client';

import { useState, useEffect } from 'react';
import { validateInviteCode, getAllValidCodes, getValidCodesCount } from '@/lib/invite/validation';

export default function TestInviteCodesPage() {
  const [validCodes, setValidCodes] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    caseSensitivity: boolean;
    invalidCodes: boolean;
  }>({
    passed: 0,
    failed: 0,
    caseSensitivity: false,
    invalidCodes: false,
  });

  useEffect(() => {
    const codes = getAllValidCodes();
    setValidCodes(codes);
    setTotalCount(getValidCodesCount());

    // Run tests
    runTests(codes);
  }, []);

  const runTests = (codes: string[]) => {
    let passed = 0;
    let failed = 0;

    // Test each valid code
    codes.forEach((code) => {
      if (validateInviteCode(code)) {
        passed++;
      } else {
        failed++;
      }
    });

    // Test case sensitivity
    const testCode = codes[0];
    const caseVariations = [
      testCode.toLowerCase(),
      testCode.toUpperCase(),
      testCode.charAt(0).toLowerCase() + testCode.slice(1).toUpperCase(),
    ];
    const caseSensitivityPassed = caseVariations.every((variation) =>
      validateInviteCode(variation),
    );

    // Test invalid codes
    const invalidCodes = ['INVALID', 'WRONG_CODE', 'TEST123', '', '   '];
    const invalidCodesPassed = invalidCodes.every((code) => !validateInviteCode(code));

    setTestResults({
      passed,
      failed,
      caseSensitivity: caseSensitivityPassed,
      invalidCodes: invalidCodesPassed,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#EAFD66] mb-2">Invite Code System Test</h1>
          <p className="text-zinc-400">Testing {totalCount} generated invite codes</p>
        </div>

        {/* Test Results */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="text-2xl font-bold text-green-400">{testResults.passed}</div>
            <div className="text-sm text-zinc-400">Valid Codes Passed</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="text-2xl font-bold text-red-400">{testResults.failed}</div>
            <div className="text-sm text-zinc-400">Valid Codes Failed</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="text-2xl font-bold text-[#EAFD66]">
              {testResults.caseSensitivity ? '✅' : '❌'}
            </div>
            <div className="text-sm text-zinc-400">Case Sensitivity</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="text-2xl font-bold text-[#EAFD66]">
              {testResults.invalidCodes ? '✅' : '❌'}
            </div>
            <div className="text-sm text-zinc-400">Invalid Code Rejection</div>
          </div>
        </div>

        {/* All Valid Codes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#EAFD66]">All Valid Codes</h2>
            <button
              onClick={() => copyToClipboard(validCodes.join('\n'))}
              className="bg-[#EAFD66] text-[#111111] px-4 py-2 rounded-lg font-medium hover:bg-[#F2FF7A] transition-colors"
            >
              Copy All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {validCodes.map((code, index) => (
              <div
                key={code}
                className="bg-zinc-800 rounded-lg p-3 border border-zinc-700 hover:border-[#EAFD66]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm text-[#EAFD66]">{code}</div>
                    <div className="text-xs text-zinc-400">#{index + 1}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(code)}
                    className="text-zinc-400 hover:text-[#EAFD66] transition-colors text-xs"
                    title="Copy code"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Sensitivity Test */}
          <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#EAFD66]">Case Sensitivity Test</h3>
            <div className="space-y-2">
              {validCodes[0] &&
                (() => {
                  const testCode = validCodes[0];
                  const variations = [
                    testCode.toLowerCase(),
                    testCode.toUpperCase(),
                    testCode.charAt(0).toLowerCase() + testCode.slice(1).toUpperCase(),
                  ];
                  return variations.map((variation, index) => {
                    const isValid = validateInviteCode(variation);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-mono text-sm">{variation}</span>
                        <span className={isValid ? 'text-green-400' : 'text-red-400'}>
                          {isValid ? '✅ Valid' : '❌ Invalid'}
                        </span>
                      </div>
                    );
                  });
                })()}
            </div>
          </div>

          {/* Invalid Code Test */}
          <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#EAFD66]">Invalid Code Test</h3>
            <div className="space-y-2">
              {['INVALID', 'WRONG_CODE', 'TEST123', '', '   '].map((code, index) => {
                const isValid = validateInviteCode(code);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-mono text-sm">{code || '(empty)'}</span>
                    <span className={!isValid ? 'text-green-400' : 'text-red-400'}>
                      {!isValid ? '✅ Rejected' : '❌ Accepted (ERROR!)'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-[#EAFD66]">Test Summary</h3>
          <div className="space-y-2 text-sm">
            <div>
              ✅ Valid codes tested: {testResults.passed}/{totalCount}
            </div>
            <div>✅ Case sensitivity: {testResults.caseSensitivity ? 'Working' : 'Failed'}</div>
            <div>✅ Invalid code rejection: {testResults.invalidCodes ? 'Working' : 'Failed'}</div>
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <strong className="text-[#EAFD66]">
                {testResults.failed === 0 && testResults.caseSensitivity && testResults.invalidCodes
                  ? '🎉 All tests passed! Invite code system is working correctly.'
                  : '⚠️ Some tests failed. Please check the implementation.'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
