'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../ChannelHero.module.css';
import { AddChannelButton } from './AddChannelButton';
import { SimpleHeroProps, Question } from '../types';

export function SimpleHero({ 
  onToggleDesign, 
  className = '',
  trendingQuestions: customTrendingQuestions,
  searchSource = 'simple-hero'
}: SimpleHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Memoized trending questions with categories
  const trendingQuestions: Question[] = useMemo(() => 
    customTrendingQuestions || [
      { id: '1', text: "What's your favorite coffee brewing method?", category: 'lifestyle' },
      { id: '2', text: 'Which music genre speaks to your soul?', category: 'entertainment' },
      { id: '3', text: "What's your ideal weekend activity?", category: 'lifestyle' },
      { id: '4', text: 'Which art style resonates with you?', category: 'culture' },
      { id: '5', text: "What's your preferred workout style?", category: 'wellness' },
      { id: '6', text: 'Which cuisine do you crave most?', category: 'culture' },
      { id: '7', text: "What's your go-to fashion aesthetic?", category: 'lifestyle' },
      { id: '8', text: 'Which travel destination calls to you?', category: 'culture' },
      { id: '9', text: "What's your favorite way to unwind?", category: 'wellness' },
      { id: '10', text: 'Which book genre captures your imagination?', category: 'entertainment' },
      { id: '11', text: "What's your preferred home decor style?", category: 'lifestyle' },
      { id: '12', text: 'Which hobby brings you the most joy?', category: 'wellness' },
      { id: '13', text: "What's your ideal social gathering size?", category: 'lifestyle' },
      { id: '14', text: 'Which season matches your personality?', category: 'lifestyle' },
      { id: '15', text: "What's your preferred learning style?", category: 'wellness' },
      { id: '16', text: "What's your favorite way to start the day?", category: 'wellness' },
      { id: '17', text: 'Which type of art do you find most inspiring?', category: 'culture' },
      { id: '18', text: "What's your preferred way to stay active?", category: 'wellness' },
      { id: '19', text: "Which culture's cuisine interests you most?", category: 'culture' },
      { id: '20', text: "What's your ideal vacation style?", category: 'lifestyle' },
    ],
    [customTrendingQuestions]
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

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handle trending question click
  const handleQuestionClick = useCallback((question: Question) => {
    const searchParams = new URLSearchParams({
      q: question.text,
      type: 'trending',
      category: question.category,
      source: searchSource,
    });

    router.push(`/channels?${searchParams.toString()}`);
  }, [router, searchSource]);

  return (
    <div className={`${styles.simpleHero} ${className}`}>
      <div className={styles.simpleHeroContent}>
        {/* Hero Title Section */}
        <div className={styles.simpleHeroTitle}>
          <h1
            className={`${styles.simpleMainTitle} cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={handleTitleClick}
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
            Your Taste Your Trend
          </h1>
          <p className={styles.simpleSubtitle}>
            Decoding the stories behind every taste
          </p>
        </div>

        {/* Add Channel Button */}
        <div className="flex justify-center mb-6">
          <AddChannelButton variant="simple" />
        </div>

        {/* Search Form */}
        <form 
          onSubmit={handleSearch} 
          className={styles.simpleSearchForm}
          role="search"
          aria-label="Search for channels and content"
        >
          <div className="relative w-full max-w-2xl mx-auto px-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your interests, hobbies, or preferences..."
              disabled={isSearching}
              aria-describedby="simple-search-description"
              className="
                w-full
                px-4 py-3 pl-12
                bg-white/10 backdrop-blur-sm
                border border-white/20
                rounded-full
                text-white placeholder-white/60
                focus:outline-none focus:ring-2 focus:ring-[#EAFD66]/50 focus:border-[#EAFD66]/50
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
            
            {/* Search Icon */}
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60"
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                role="status"
                aria-label="Searching..."
              >
                <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
            )}
          </div>
          
          {/* Search Description for Screen Readers */}
          <div id="simple-search-description" className="sr-only">
            Search for channels and content based on your interests and preferences
          </div>
        </form>

        {/* Scrolling Questions */}
        <div className={styles.scrollingQuestionsContainer}>
          <div 
            className={styles.scrollingQuestions}
            role="list"
            aria-label="Trending questions to explore"
          >
            {/* Original questions */}
            {trendingQuestions.map((question) => (
              <div
                key={question.id}
                className={styles.scrollingQuestion}
                onClick={() => handleQuestionClick(question)}
                role="listitem"
                tabIndex={0}
                aria-label={`Click to search for: ${question.text}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleQuestionClick(question);
                  }
                }}
              >
                {question.text}
              </div>
            ))}
            
            {/* Duplicate questions for seamless loop */}
            {trendingQuestions.map((question) => (
              <div
                key={`duplicate-${question.id}`}
                className={styles.scrollingQuestion}
                onClick={() => handleQuestionClick(question)}
                role="listitem"
                tabIndex={0}
                aria-label={`Click to search for: ${question.text}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleQuestionClick(question);
                  }
                }}
              >
                {question.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
