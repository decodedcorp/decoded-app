'use client';

import React from 'react';

import { useAddChannelStore } from '@/store/addChannelStore';

interface AddChannelButtonProps {
  variant?: 'default' | 'simple';
}

export function AddChannelButton({ variant = 'default' }: AddChannelButtonProps) {
  const openModal = useAddChannelStore((state) => state.openModal);

  const handleClick = () => {
    openModal();
  };

  if (variant === 'simple') {
    return (
      <button
        onClick={handleClick}
        className="
          inline-flex items-center gap-2
          px-6 py-3
          bg-[#EAFD66] text-black
          rounded-full
          font-semibold text-base
          hover:bg-[#D4E85A] 
          active:bg-[#C4D850]
          transition-all duration-200
          shadow-lg hover:shadow-xl
          transform hover:scale-105 active:scale-95
          border-2 border-[#EAFD66]
          hover:border-[#D4E85A]
        "
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add Channel
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="
        inline-flex items-center gap-3
        px-8 py-4
        bg-[#EAFD66] text-black
        rounded-full
        font-bold text-lg
        hover:bg-[#D4E85A] 
        active:bg-[#C4D850]
        transition-all duration-300
        shadow-2xl hover:shadow-3xl
        transform hover:scale-105 active:scale-95
        border-2 border-[#EAFD66]
        hover:border-[#D4E85A]
        backdrop-blur-sm
        hover:backdrop-blur-md
      "
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      Add Channel
    </button>
  );
}
