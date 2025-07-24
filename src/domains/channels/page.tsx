'use client';

import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChannelSidebar, SidebarFilters } from './components/sidebar/ChannelSidebar';
import { ChannelMainContent } from './components/layout/ChannelMainContent';

export default function ChannelPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // 사이드바가 접혔을 때는 더 넓은 Grid 사용
  const gridClasses = isSidebarCollapsed
    ? 'grid grid-cols-1 lg:grid-cols-[80px_1fr] h-screen w-full bg-black overflow-hidden'
    : 'grid grid-cols-1 lg:grid-cols-[320px_1fr] h-screen w-full bg-black overflow-hidden';

  return (
    <div className={gridClasses}>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
      >
        {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {/* Sidebar Grid Area */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:col-start-1 lg:col-end-2
        `}
      >
        <ChannelSidebar
          onFilterChange={handleFilterChange}
          onCollapseChange={handleSidebarCollapse}
          className={`h-full border-r border-gray-800 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-20' : 'w-80'
          }`}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Grid Area */}
      <div className="lg:col-start-2 lg:col-end-3 h-full overflow-y-auto">
        <ChannelMainContent className="h-full" />
      </div>
    </div>
  );
}
