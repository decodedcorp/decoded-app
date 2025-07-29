'use client';

import React, { useState, useEffect } from 'react';
import { getTokenInfo, forceUpdateAccessToken } from '../utils/tokenManager';

export const TokenDebugger: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [newToken, setNewToken] = useState('');

  const updateTokenInfo = () => {
    const info = getTokenInfo();
    setTokenInfo(info);
  };

  useEffect(() => {
    updateTokenInfo();
  }, []);

  const handleForceUpdate = () => {
    if (newToken.trim()) {
      forceUpdateAccessToken(newToken.trim());
      updateTokenInfo();
      setNewToken('');
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-zinc-800 border border-zinc-700 rounded-lg p-4 max-w-md z-50">
      <h3 className="text-white font-semibold mb-2">Token Debugger</h3>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-zinc-400">Has Token:</span>
          <span className={`ml-2 ${tokenInfo?.hasToken ? 'text-green-400' : 'text-red-400'}`}>
            {tokenInfo?.hasToken ? 'Yes' : 'No'}
          </span>
        </div>

        <div>
          <span className="text-zinc-400">Is Expired:</span>
          <span className={`ml-2 ${tokenInfo?.isExpired ? 'text-red-400' : 'text-green-400'}`}>
            {tokenInfo?.isExpired ? 'Yes' : 'No'}
          </span>
        </div>

        {tokenInfo?.expiresIn !== undefined && (
          <div>
            <span className="text-zinc-400">Expires In:</span>
            <span className="ml-2 text-white">
              {Math.floor(tokenInfo.expiresIn / 3600)}h{' '}
              {Math.floor((tokenInfo.expiresIn % 3600) / 60)}m
            </span>
          </div>
        )}

        {tokenInfo?.payload && (
          <div>
            <span className="text-zinc-400">User ID:</span>
            <span className="ml-2 text-white font-mono text-xs">{tokenInfo.payload.sub}</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <input
          type="text"
          value={newToken}
          onChange={(e) => setNewToken(e.target.value)}
          placeholder="Paste new token here"
          className="w-full px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-white text-xs"
        />
        <button
          onClick={handleForceUpdate}
          className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
        >
          Force Update Token
        </button>
        <button
          onClick={updateTokenInfo}
          className="w-full px-2 py-1 bg-zinc-600 hover:bg-zinc-700 rounded text-white text-xs"
        >
          Refresh Info
        </button>
      </div>
    </div>
  );
};
