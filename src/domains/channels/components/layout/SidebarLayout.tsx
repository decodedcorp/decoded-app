'use client';

import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChannelSidebar, SidebarFilters } from '../sidebar/ChannelSidebar';
import { ChannelMainContent } from './ChannelMainContent';

interface SidebarLayoutProps {
  className?: string;
}

export function SidebarLayout({ className = '' }: SidebarLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SidebarFilters>({
    dataTypes: [],
    categories: [],
    tags: [],
  });

  const handleFilterChange = (filters: SidebarFilters) => {
    setCurrentFilters(filters);
    console.log('Filters changed:', filters);
    // TODO: Implement filter logic for content
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex h-screen w-full bg-black overflow-hidden ${className}`}>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
      >
        {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:flex-shrink-0
        `}
      >
        <ChannelSidebar
          onFilterChange={handleFilterChange}
          className="h-full w-80 border-r border-gray-800"
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Container */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <ChannelMainContent className="h-full" />
      </div>
    </div>
  );
}
