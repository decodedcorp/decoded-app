'use client';

import React, { useState, useEffect } from 'react';
import { LinkPreviewCard } from '../LinkPreviewCard';
import { validateUrl } from '../../utils/contentHelpers';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { LinkPreview } from '@/lib/services/mockLinkPreview';

interface Step1LinkInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  preview?: LinkPreview | null;
  isLoadingPreview?: boolean;
  previewError?: string | null;
}

export function Step1LinkInput({
  url,
  onUrlChange,
  preview,
  isLoadingPreview = false,
  previewError = null,
}: Step1LinkInputProps) {
  const t = useCommonTranslation();
  const [localUrl, setLocalUrl] = useState(url);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setLocalUrl(url);
  }, [url]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setLocalUrl(newUrl);
    setValidationError(null);
    onUrlChange(newUrl);
  };

  const handleBlur = () => {
    if (localUrl.trim() && !validateUrl(localUrl)) {
      setValidationError('Please enter a valid URL');
    } else {
      setValidationError(null);
    }
  };

  const isValid = localUrl.trim() && validateUrl(localUrl);

  return (
    <div className="space-y-6 py-4 px-4">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">링크 입력</h2>
        <p className="text-sm text-zinc-400">콘텐츠를 추가할 링크의 URL을 입력하세요</p>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="link-url" className="block text-sm font-medium text-zinc-300 mb-2">
            URL
          </label>
          <input
            id="link-url"
            type="text"
            value={localUrl}
            onChange={handleUrlChange}
            onBlur={handleBlur}
            placeholder="https://example.com"
            className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              validationError ? 'border-red-500' : 'border-zinc-700'
            }`}
          />
          {validationError && <p className="text-sm text-red-400 mt-1">{validationError}</p>}
        </div>

        {isValid && preview && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-zinc-300 mb-2">미리보기</h3>
            <LinkPreviewCard preview={preview} isLoading={isLoadingPreview} error={previewError} />
          </div>
        )}
      </div>
    </div>
  );
}
