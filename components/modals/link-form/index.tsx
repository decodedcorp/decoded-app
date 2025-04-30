'use client';

import { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { LinkCard, LinkMetadata } from './components/link-preview/link-card';
import { useOGTags } from '@/lib/hooks/features/metadata/useOGTags';

interface LinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { url: string }) => void;
  imageId?: string;
}

export function LinkForm({
  isOpen,
  onClose,
  onSubmit,
  imageId,
}: LinkFormProps) {
  // 상태 관리
  const [url, setUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [isClosing, setIsClosing] = useState(false);
  const [linkMetadata, setLinkMetadata] = useState<LinkMetadata | null>(null);
  const [view, setView] = useState<'form' | 'card'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OG 태그 데이터 가져오기
  const { data: ogTags, isLoading, error } = useOGTags(previewUrl);
  // Card image 비율
  // Card 로딩 스켈레톤
  // - Card 삭제버튼
  // Card 모달 비율

  useEffect(() => {
    console.log('ogTags:', ogTags);
    console.log('previewUrl:', previewUrl);
    console.log('linkMetadata:', linkMetadata);

    if (ogTags && previewUrl) {
      const metadata: LinkMetadata = {
        url: previewUrl,
        title: ogTags.title || new URL(previewUrl).hostname,
        description: ogTags.description || '',
        image: ogTags.image || '',
        favicon: '',
      };

      setLinkMetadata(metadata);
      setView('card');
    }
  }, [ogTags, previewUrl]);

  useEffect(() => {
    // 모달이 닫힐 때는 입력 폼으로 리셋
    if (!isOpen) {
      setUrl('');
      setPreviewUrl(undefined);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ url });

    // API를 통해 OG 태그 데이터 가져오기
    fetchAndSetMetadata(url);
  };

  // 메타데이터 생성 함수
  const fetchAndSetMetadata = (url: string) => {
    try {
      // URL을 설정하여 OG 태그 쿼리 시작
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error setting URL for OG tags:', error);
      alert('링크 정보를 가져오는 중 오류가 발생했습니다.');
    }
  };

  // 링크 삭제 함수
  const handleRemoveLink = () => {
    setLinkMetadata(null);
    setPreviewUrl(undefined);
    setView('form');
  };

  // 폼 보기로 전환하는 함수
  const goToForm = () => {
    setView('form');
    setUrl('');
    setPreviewUrl(undefined);
  };

  // 최종 제출 함수
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    // 실제로 최종 제출하는 로직 (API 호출 등)
    try {
      // onSubmit이 이미 URL 추가 시 호출되므로, 여기서는 다른 처리가 필요하면 추가
      console.log('최종 제출됨:', linkMetadata?.url);
      setTimeout(() => {
        handleClose();
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('제출 오류:', error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isSubmitDisabled = !url.trim();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 
      bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-[#111111] p-6 rounded-xl w-full max-w-md shadow-2xl 
        transition-transform duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* 헤더 부분 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            {view === 'card' && linkMetadata && (
              <button
                onClick={goToForm}
                className="mr-3 text-white/60 hover:text-white/90 transition-colors p-1"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-lg font-medium text-white/90">
              {view === 'card' && linkMetadata
                ? '추가된 링크'
                : '링크 추가하기'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white/90 transition-colors p-1"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 링크 입력 폼 */}
        {view === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-white/5 
                text-white/90 placeholder-gray-500 focus:border-[#EAFD66] 
                focus:ring-1 focus:ring-[#EAFD66] transition-colors outline-none
                hover:border-white/10 text-sm"
                required
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium
                        hover:border-gray-400 hover:text-white/90 transition-colors text-sm"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitDisabled || isLoading}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-medium transition-colors text-sm
                  ${
                    !isSubmitDisabled && !isLoading
                      ? 'bg-[#EAFD66] text-black hover:bg-[#d9ec55] shadow-md shadow-[#EAFD66]/20'
                      : 'bg-[#1A1A1A] text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? '로딩중...' : '추가'}
              </button>
            </div>
          </form>
        )}

        {/* 링크 카드 (로딩 상태 표시 포함) */}
        {view === 'card' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="p-4 bg-[#1A1A1A] rounded-lg flex items-center justify-center h-32">
                <p className="text-white/70">링크 정보를 가져오는 중...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-[#1A1A1A] rounded-lg flex items-center justify-center h-32">
                <p className="text-red-400">링크 정보를 가져오지 못했습니다.</p>
              </div>
            ) : (
              linkMetadata && (
                <LinkCard metadata={linkMetadata} onRemove={handleRemoveLink} />
              )
            )}

            {!isLoading && !error && linkMetadata && (
              <div className="mt-5">
                {/* 최종 제출 버튼 */}
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[#EAFD66] text-black hover:bg-[#d9ec55] 
                    rounded-lg font-medium transition-all duration-300 shadow-md shadow-[#EAFD66]/20
                    hover:shadow-lg hover:shadow-[#EAFD66]/25 text-sm"
                >
                  {isSubmitting ? '제출 중...' : '제출'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
