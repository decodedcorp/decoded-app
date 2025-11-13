'use client';

import { useState, useMemo } from 'react';
import MetaBallCards, { type CardData } from '@/components/three/MetaBallCards';
import { getMockLinkPreview } from '@/lib/services/mockLinkPreview';

export default function MetaBallsTestPage() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Generate card data with mock previews
  const cardData = useMemo<CardData[]>(() => {
    const mockUrls = [
      'https://github.com',
      'https://medium.com',
      'https://stackoverflow.com',
      'https://dev.to',
    ];

    const cards: CardData[] = mockUrls.map((url, idx) => {
      const preview = getMockLinkPreview(url);
      const isFixed = idx === 0; // First card is fixed

      if (isFixed) {
        return {
          id: `card-${idx}`,
          preview,
          position: { x: 0, y: 0 },
          size: { width: 3, height: 2 },
          isFixed: true,
          isHovered: hoveredCardId === `card-${idx}`,
          isSelected: selectedCardId === `card-${idx}`,
        };
      } else {
        const angle = ((idx - 1) / (mockUrls.length - 1)) * Math.PI * 2;
        return {
          id: `card-${idx}`,
          preview,
          position: { x: Math.cos(angle) * 8, y: Math.sin(angle) * 8 },
          size: { width: 2.5, height: 1.8 },
          isFixed: false,
          isHovered: hoveredCardId === `card-${idx}`,
          isSelected: selectedCardId === `card-${idx}`,
        };
      }
    });

    return cards;
  }, [hoveredCardId, selectedCardId]);

  const handleCardClick = (cardId: string) => {
    console.log('Card clicked:', cardId);
    setSelectedCardId(cardId === selectedCardId ? null : cardId);
  };

  const handleCardHover = (cardId: string | null) => {
    setHoveredCardId(cardId);
  };

  return (
    <div className="min-h-screen w-full bg-black p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">MetaBalls Interactive Cards</h1>
          <p className="text-zinc-400">
            Theme color: <span className="text-[#e9fd66]">#e9fd66</span> | Click to select cards
          </p>
        </div>

        <div className="relative w-full h-[600px] bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-zinc-800">
          <MetaBallCards
            cards={cardData}
            fixedCardIds={cardData.filter((c) => c.isFixed).map((c) => c.id)}
            primaryColor="#e9fd66"
            hoverColor="#f0ff80"
            selectedColor="#d9f54a"
            ballCount={cardData.length}
            animationSize={30}
            enableMouseInteraction={true}
            enableTransparency={false}
            hoverSmoothness={0.05}
            clumpFactor={1}
            speed={0.3}
            onCardClick={handleCardClick}
            onCardHover={handleCardHover}
          />
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 space-y-2">
          <div className="text-sm text-zinc-300">
            <strong className="text-[#e9fd66]">Selected Card:</strong> {selectedCardId || 'None'}
          </div>
          <div className="text-sm text-zinc-300">
            <strong className="text-[#f0ff80]">Hovered Card:</strong> {hoveredCardId || 'None'}
          </div>
        </div>
      </div>
    </div>
  );
}
