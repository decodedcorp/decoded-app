'use client';

import React from 'react';

export function ChannelHero() {
  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Title - Decoded 스타일 */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8">
          Creative Channels
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover unexpected and original content that makes the internet vibrant.
        </p>
      </div>
    </section>
  );
} 