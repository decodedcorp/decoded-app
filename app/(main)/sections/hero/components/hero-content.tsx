'use client';

import Link from 'next/link';

export function HeroContent() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground whitespace-pre-line text-center max-w-3xl">
        {'찾고싶은 제품을\n지금 바로 요청해보세요'}
      </h1>
      <Link
        href="/request"
        className="inline-flex h-11 items-center justify-center rounded-none px-8 py-3 bg-primary font-mono font-bold text-black hover:bg-primary/90 transition-colors"
      >
        요청하기
      </Link>
    </div>
  );
}
