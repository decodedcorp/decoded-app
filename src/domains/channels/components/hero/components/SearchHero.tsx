'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../ChannelHero.module.css';
import GlitchText from './GlitchText';
import { AddChannelButton } from './AddChannelButton';
import { SearchHeroProps, Question } from '../types';

export function SearchHero({ 
  onToggleDesign, 
  className = '',
  placeholderQuestions: customPlaceholderQuestions,
  searchSource = 'hero'
}: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const router = useRouter();

  // Memoized placeholder questions with categories
  const placeholderQuestions: Question[] = useMemo(() => 
    customPlaceholderQuestions || [
      { id: '1', text: 'Ask about your interests, hobbies, or preferences...', category: 'general' },
      { id: '2', text: 'What kind of content do you love to consume?', category: 'specific' },
      { id: '3', text: 'Tell me about your favorite topics or passions...', category: 'emotional' },
      { id: '4', text: 'What are you curious about today?', category: 'general' },
      { id: '5', text: 'Share your interests and discover new channels...', category: 'specific' },
      { id: '6', text: 'What topics make you excited to learn more?', category: 'emotional' },
      { id: '7', text: 'Describe your ideal content experience...', category: 'general' },
      { id: '8', text: 'What would you like to explore today?', category: 'specific' },
      { id: '9', text: 'Tell me about your favorite activities or hobbies...', category: 'emotional' },
      { id: '10', text: 'What kind of stories resonate with you?', category: 'general' },
      { id: '11', text: 'Share your interests and find your community...', category: 'specific' },
      { id: '12', text: 'What topics spark your curiosity?', category: 'emotional' },
      { id: '13', text: "Describe what you're passionate about...", category: 'general' },
      { id: '14', text: 'What content brings you joy and inspiration?', category: 'specific' },
      { id: '15', text: 'Tell me about your favorite things to learn...', category: 'emotional' },
    ], 
    [customPlaceholderQuestions]
  );

  // Auto-rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderQuestions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholderQuestions.length]);

  // Memoized current placeholder
  const currentPlaceholder = useMemo(() => 
    placeholderQuestions[currentPlaceholderIndex], 
    [placeholderQuestions, currentPlaceholderIndex]
  );

  // Handle search submission
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const searchParams = new URLSearchParams({
        q: searchQuery.trim(),
        type: 'search',
        source: searchSource,
      });

      router.push(`/channels?${searchParams.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
      // TODO: Add proper error handling with toast notification
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, router, searchSource]);

  // Handle keyboard events
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  }, [handleSearch]);

  // Handle title click for design toggle
  const handleTitleClick = useCallback(() => {
    onToggleDesign?.();
  }, [onToggleDesign]);

  // Handle input change with debouncing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className={`${styles.searchHero} ${className}`}>
      <div className={styles.heroContent}>
        {/* Hero Title Section */}
        <div className={styles.heroTitle}>
          <div 
            onClick={handleTitleClick} 
            className="cursor-pointer transition-opacity hover:opacity-80"
            role="button"
            tabIndex={0}
            aria-label="Toggle hero design mode"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTitleClick();
              }
            }}
          >
            <GlitchText
              speed={0.8}
              enableShadows={true}
              enableOnHover={true}
              className={`text-center mb-4 ${styles.glitchText}`}
            >
              Your Taste Your Trend
            </GlitchText>
          </div>
          <p className={styles.subtitle}>
            Decoding the stories behind every taste
          </p>
        </div>

        {/* Add Channel Button */}
        <div className="flex justify-center mb-8">
          <AddChannelButton variant="default" />
        </div>

        {/* Search Form */}
        <form 
          onSubmit={handleSearch} 
          className={styles.searchForm}
          role="search"
          aria-label="Search for channels and content"
        >
          <div className="relative w-full mx-auto px-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={currentPlaceholder.text}
              disabled={isSearching}
              aria-describedby="search-description"
              className="
                w-full
                px-6 py-4 pl-14
                bg-white/10 backdrop-blur-sm
                border border-white/20
                rounded-full
                text-white placeholder-white/60
                focus:outline-none focus:ring-2 focus:ring-[#EAFD66]/50 focus:border-[#EAFD66]/50
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                text-lg
                shadow-lg
                hover:bg-white/15
                hover:border-white/30
              "
            />
            
            {/* Search Icon */}
            <svg
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            
            {/* Loading Spinner */}
            {isSearching && (
              <div 
                className="absolute right-6 top-1/2 transform -translate-y-1/2"
                role="status"
                aria-label="Searching..."
              >
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
            )}
          </div>
          
          {/* Search Description for Screen Readers */}
          <div id="search-description" className="sr-only">
            Search for channels and content based on your interests and preferences
          </div>
        </form>
      </div>
    </div>
  );
}
