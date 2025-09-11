import { useState, useEffect } from 'react';

// 로케일 파일 import
import koTranslations from '@/locales/ko/common.json';
import enTranslations from '@/locales/en/common.json';

// @deprecated This hook is deprecated. Use useCommonTranslation from '@/lib/i18n/hooks' instead.
// 간단한 로케일 상태 관리 - DEPRECATED
const useLocale = () => {
  console.warn('⚠️ useLocale is deprecated. Use useCommonTranslation from "@/lib/i18n/hooks" instead.');
  const [locale, setLocale] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    // 브라우저 언어 설정 확인
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') {
      setLocale('en');
    }
  }, []);

  const t = (key: string, variables?: Record<string, string | number>) => {
    // 중첩된 키를 처리하는 함수 (예: 'search.placeholder')
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    const translations = locale === 'ko' ? koTranslations : enTranslations;
    let translation = getNestedValue(translations, key) || key;

    // 변수 치환 처리 (예: {{query}}, {{count}})
    if (variables) {
      Object.entries(variables).forEach(([varKey, value]) => {
        const placeholder = `{{${varKey}}}`;
        translation = translation.replace(new RegExp(placeholder, 'g'), String(value));
      });
    }

    return translation;
  };

  return { locale, setLocale, t };
};

export { useLocale };
