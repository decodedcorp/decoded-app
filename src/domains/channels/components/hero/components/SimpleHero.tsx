'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../ChannelHero.module.css';

interface SimpleHeroProps {
  onToggleDesign?: () => void;
}

const trendingQuestions = [
  "What's your favorite coffee brewing method?",
  "Which music genre speaks to your soul?",
  "What's your ideal weekend activity?",
  "Which art style resonates with you?",
  "What's your preferred workout style?",
  "Which cuisine do you crave most?",
  "What's your go-to fashion aesthetic?",
  "Which travel destination calls to you?",
  "What's your favorite way to unwind?",
  "Which book genre captures your imagination?",
  "What's your preferred home decor style?",
  "Which hobby brings you the most joy?",
  "What's your ideal social gathering size?",
  "Which season matches your personality?",
  "What's your preferred learning style?",
  "What's your favorite way to start the day?",
  "Which type of art do you find most inspiring?",
  "What's your preferred way to stay active?",
  "Which culture's cuisine interests you most?",
  "What's your ideal vacation style?"
];

export function SimpleHero({ onToggleDesign }: SimpleHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const searchParams = new URLSearchParams({
        q: searchQuery.trim(),
        type: 'search',
      });

      router.push(`/channels?${searchParams.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };

  const handleTitleClick = () => {
    if (onToggleDesign) {
      onToggleDesign();
    }
  };

  return (
    <div className={styles.simpleHero}>
      <div className={styles.simpleHeroContent}>
        <div className={styles.simpleHeroTitle}>
          <h1 
            className={`${styles.simpleMainTitle} cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={handleTitleClick}
          >
            Your Taste Your Trend
          </h1>
          <p className={styles.simpleSubtitle}>Decoding the stories behind every taste</p>
        </div>

        <form onSubmit={handleSearch} className={styles.simpleSearchForm}>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your interests, hobbies, or preferences..."
              disabled={isSearching}
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
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
            )}
          </div>
        </form>

        <div className={styles.scrollingQuestionsContainer}>
          <div className={styles.scrollingQuestions}>
            {trendingQuestions.map((question, index) => (
              <div 
                key={index} 
                className={styles.scrollingQuestion}
                onClick={() => {
                  const searchParams = new URLSearchParams({
                    q: question,
                    type: 'trending'
                  });
                  router.push(`/channels?${searchParams.toString()}`);
                }}
              >
                {question}
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {trendingQuestions.map((question, index) => (
              <div 
                key={`duplicate-${index}`} 
                className={styles.scrollingQuestion}
                onClick={() => {
                  const searchParams = new URLSearchParams({
                    q: question,
                    type: 'trending'
                  });
                  router.push(`/channels?${searchParams.toString()}`);
                }}
              >
                {question}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
