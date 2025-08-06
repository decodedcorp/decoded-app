'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../ChannelHero.module.css';
import GlitchText from './GlitchText';

interface SearchHeroProps {
  onToggleDesign?: () => void;
}

export function SearchHero({ onToggleDesign }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const router = useRouter();

  const placeholderQuestions = [
    'Ask about your interests, hobbies, or preferences...',
    'What kind of content do you love to consume?',
    'Tell me about your favorite topics or passions...',
    'What are you curious about today?',
    'Share your interests and discover new channels...',
    'What topics make you excited to learn more?',
    'Describe your ideal content experience...',
    'What would you like to explore today?',
    'Tell me about your favorite activities or hobbies...',
    'What kind of stories resonate with you?',
    'Share your interests and find your community...',
    'What topics spark your curiosity?',
    "Describe what you're passionate about...",
    'What content brings you joy and inspiration?',
    'Tell me about your favorite things to learn...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderQuestions.length);
    }, 3000); // Change placeholder every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      // TODO: Implement actual search functionality
      // For now, we'll just navigate to channels page with search query
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
    <div className={styles.searchHero}>
      <div className={styles.heroContent}>
        <div className={styles.heroTitle}>
          <div onClick={handleTitleClick} className="cursor-pointer">
            <GlitchText
              speed={0.8}
              enableShadows={true}
              enableOnHover={true}
              className={`text-center mb-4 ${styles.glitchText}`}
            >
              Your Taste Your Trend
            </GlitchText>
          </div>
          <p className={styles.subtitle}>Decoding the stories behind every taste</p>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className="relative w-full max-w-4xl mx-auto px-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholderQuestions[currentPlaceholderIndex]}
              disabled={isSearching}
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
            <svg
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60"
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
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
