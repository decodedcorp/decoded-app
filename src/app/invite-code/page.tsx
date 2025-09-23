'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setInviteCode } from '@/lib/invite/storage';
import { getValidationError } from '@/lib/invite/validation';
import DomeGallery from '@/components/DomeGallery';

export default function InviteCodePage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const domeRef = useRef<any>(null);

  const nextUrl = searchParams.get('next') || '/';

  useEffect(() => {
    // Auto-fill from URL parameter if present (?iv=CODE)
    const ivParam = searchParams.get('iv');
    if (ivParam) {
      setCode(ivParam);
    }
  }, [searchParams]);

  // 자동 회전 애니메이션
  useEffect(() => {
    if (!domeRef.current) return;

    let animationId: number;
    let startTime = Date.now();
    const rotationSpeed = 1; // 회전 속도 (도/초) - 더 빠르게

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const rotationY = elapsed * rotationSpeed;

      // DomeGallery의 내부 회전 메서드 호출
      if (domeRef.current && domeRef.current.applyTransform) {
        domeRef.current.applyTransform(0, rotationY);
      }

      animationId = requestAnimationFrame(animate);
    };

    // 약간의 지연 후 애니메이션 시작
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const validationError = getValidationError(code);
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Store the valid code
      setInviteCode(code);

      // Brief delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to intended destination
      router.replace(nextUrl);
    } catch (err) {
      setError('처리 중 오류가 발생했습니다');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen-safe bg relative flex items-center justify-center px-6 mobile-safe-area">
      {/* 배경 영역 - 3D 돔 갤러리 */}
      <div className="absolute inset-0 w-full h-full">
        <DomeGallery
          ref={domeRef}
          fit={0.8}
          fitBasis="auto"
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={true}
          overlayBlurColor="#111111"
          padFactor={0.25}
          useApi={true}
          limit={20}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full max-w-sm space-y-8 animate-fade-in">
        {/* 콘텐츠 배경 */}
        <div className="absolute inset-0 -m-8 rounded-3xl bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50" />

        {/* 콘텐츠 */}
        <div className="relative z-10 p-8">
          {/* Title */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-[#EAFD66] text-3xl md:text-4xl font-light tracking-wide">
              decoded
            </h1>
            <p className="text-lg text-zinc-300 font-light">초대코드를 입력해주세요</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <input
                id="invite-code"
                name="invite-code"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                placeholder="초대코드"
                className="w-full rounded-full border-0 bg-zinc-800/95 backdrop-blur-sm px-6 py-4 text-center text-lg font-mono tracking-wider text-white placeholder:text-zinc-400 focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#EAFD66]/40 transition-all duration-300 mobile-text-base mobile-touch-target"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(null);
                }}
                disabled={isSubmitting}
                maxLength={50}
              />

              {error && (
                <div className="text-center animate-scale-in">
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !code.trim()}
              className="w-full rounded-full bg-[#EAFD66] px-6 py-4 text-base font-medium text-[#111111] transition-all duration-300 hover:bg-[#F2FF7A] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#EAFD66]/40 disabled:cursor-not-allowed disabled:opacity-50 mobile-touch-target interactive"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#111111]/30 border-t-[#111111]" />
                  <span>확인 중...</span>
                </div>
              ) : (
                '시작하기'
              )}
            </button>
          </form>

          {/* Help text */}
          <div className="mt-8">
            <p className="text-center text-sm text-zinc-400 leading-relaxed">
              초대코드가 없으시나요? <span className="text-[#EAFD66]">관리자에게 문의해주세요</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
