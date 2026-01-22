"use client";

import { useState } from "react";
import Link from "next/link";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSuccess(true);
    setEmail("");
    setIsSubmitting(false);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="max-w-md">
      <h3 className="text-sm font-medium text-foreground mb-2">
        뉴스레터를 구독하고 최신 뉴스를 놓치지 마세요
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          className="flex-1 px-4 py-2.5 bg-card border border-border rounded-lg
                   text-sm text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                   transition-colors"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg
                   hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          {isSubmitting ? "..." : "구독"}
        </button>
      </form>
      {isSuccess && (
        <p className="mt-2 text-xs text-green-500">
          구독해 주셔서 감사합니다!
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        본 뉴스레터 구독 신청에 따라 자사의 개인정보수집 관련 이용약관에 동의한
        것으로 간주됩니다.
      </p>
    </div>
  );
}

export function MainFooter() {
  return (
    <footer className="py-12 px-4 md:px-6 lg:px-8 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">
              디코디드(주)
            </h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>서울시 강남구 도산대로 | 대표자: 정소윤, 곽동호</p>
              <p>사업자등록번호: 123-45-65890</p>
              <p>이메일: decodedapp@gmail.com | 전화번호: 010-1234-5678</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex justify-start md:justify-end">
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DECODED
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
