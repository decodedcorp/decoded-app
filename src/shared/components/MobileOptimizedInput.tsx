import React, { forwardRef } from 'react';
import { useMobileOptimization } from '@/lib/hooks/useMobileOptimization';

interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'decimal';
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  autoComplete?: string;
}

/**
 * Mobile-optimized input component with proper inputMode, enterKeyHint, and autocomplete
 */
export const MobileOptimizedInput = forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  (
    {
      label,
      error,
      helperText,
      inputMode = 'text',
      enterKeyHint = 'done',
      autoComplete,
      className = '',
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const { isMobile } = useMobileOptimization();

    // Determine inputMode based on type
    const getInputMode = () => {
      if (inputMode !== 'text') return inputMode;

      switch (type) {
        case 'email':
          return 'email';
        case 'tel':
          return 'tel';
        case 'url':
          return 'url';
        case 'number':
          return 'numeric';
        case 'search':
          return 'search';
        default:
          return 'text';
      }
    };

    // Determine enterKeyHint based on context
    const getEnterKeyHint = () => {
      if (enterKeyHint !== 'done') return enterKeyHint;

      switch (type) {
        case 'search':
          return 'search';
        case 'email':
        case 'password':
          return 'next';
        default:
          return 'done';
      }
    };

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

        <input
          ref={ref}
          type={type}
          inputMode={getInputMode()}
          enterKeyHint={getEnterKeyHint()}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 
            border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-colors duration-200
            ${isMobile ? 'mobile-text-base' : 'text-base'}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          style={{
            fontSize: isMobile ? '16px' : undefined, // Prevent zoom on iOS
          }}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  },
);

MobileOptimizedInput.displayName = 'MobileOptimizedInput';
