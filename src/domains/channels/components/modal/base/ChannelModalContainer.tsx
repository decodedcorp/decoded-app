'use client';

import React, { useState, ReactNode } from 'react';
import { SidebarFilters } from '../../sidebar/ChannelSidebar';

interface ChannelModalContainerProps {
  children: ReactNode;
  sidebar: ReactNode;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  showSidebarToggle?: boolean;
}

export function ChannelModalContainer({
  children,
  sidebar,
  isSidebarOpen,
  onSidebarToggle,
  showSidebarToggle = true,
}: ChannelModalContainerProps) {
  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[95vw] max-w-[1600px] h-[90vh] overflow-hidden animate-bounce-in shadow-2xl flex">
      {/* Sidebar */}
      <div
        className={`
          ${isSidebarOpen ? 'w-80' : 'w-0'} 
          transition-all duration-300 ease-in-out
          lg:block
          ${isSidebarOpen ? 'block animate-slide-in-left' : 'hidden'}
        `}
      >
        {sidebar}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative animate-slide-in-right">
        {/* Sidebar Toggle Button */}
        {showSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="absolute top-4 left-4 z-10 lg:hidden p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
