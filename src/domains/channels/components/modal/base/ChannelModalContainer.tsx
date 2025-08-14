'use client';

import React, { useState, ReactNode } from 'react';

import { SidebarFilters } from '../../sidebar/ChannelSidebar';

interface ChannelModalContainerProps {
  children: ReactNode;
  sidebar: ReactNode;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  showSidebarToggle?: boolean;
  isSidebarCollapsed?: boolean;
  onSidebarCollapseToggle?: () => void;
}

export function ChannelModalContainer({
  children,
  sidebar,
  isSidebarOpen,
  onSidebarToggle,
  showSidebarToggle = true,
  isSidebarCollapsed = false,
  onSidebarCollapseToggle,
}: ChannelModalContainerProps) {
  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[95vw] max-w-[1600px] h-[90vh] overflow-hidden animate-bounce-in shadow-2xl flex">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          className={`${
            isSidebarCollapsed ? 'w-16' : 'w-80'
          } transition-all duration-300 ease-in-out flex-shrink-0`}
        >
          {sidebar}
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 ${isSidebarOpen ? '' : 'w-full'}`}>
        {/* Header with Toggle Button (only for mobile or when sidebar is completely closed) */}
        {showSidebarToggle && !isSidebarOpen && (
          <div className="p-4 border-b border-zinc-700/50 bg-zinc-800/30 flex-shrink-0">
            <button
              onClick={onSidebarToggle}
              className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-all duration-200 flex items-center justify-center group"
              title="사이드바 열기"
            >
              <svg
                className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors duration-200"
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
          </div>
        )}

        {/* Content Area - children을 직접 배치 */}
        {children}
      </div>
    </div>
  );
}
