'use client';

import React from 'react';

interface PostButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PostButton({
  onClick,
  disabled = false,
  isLoading = false,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: PostButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#EAFD66] to-[#D4E85A] 
      hover:from-[#D4E85A] hover:to-[#C4D850] 
      active:from-[#C4D850] active:to-[#B4C840]
      text-black 
      border border-[#C4D850] hover:border-[#B4C840]
      shadow-md hover:shadow-lg
      hover:scale-[1.02] active:scale-95
      disabled:from-zinc-600 disabled:to-zinc-700 
      disabled:text-zinc-300 disabled:border-zinc-600
    `,
    secondary: `
      bg-transparent 
      hover:bg-gradient-to-r hover:from-[#EAFD66] hover:to-[#D4E85A]
      text-[#EAFD66] hover:text-black
      border border-[#EAFD66] hover:border-[#C4D850]
      hover:scale-[1.02] active:scale-95
      disabled:border-zinc-600 disabled:text-zinc-500
    `,
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button onClick={onClick} disabled={disabled || isLoading} className={classes}>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div
            className={`w-4 h-4 border-2 ${
              variant === 'primary' ? 'border-black' : 'border-current'
            } border-t-transparent rounded-full animate-spin`}
          ></div>
          <span>Creating...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
