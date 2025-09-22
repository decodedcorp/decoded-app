import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface QAItem {
  question: string;
  answer: string;
}

interface InteractiveQAItemProps {
  qa: QAItem;
  isOpen: boolean;
  onToggle: () => void;
}

function InteractiveQAItem({ qa, isOpen, onToggle }: InteractiveQAItemProps) {
  return (
    <div className="border border-zinc-700/30 rounded-lg overflow-hidden bg-zinc-800/30 hover:bg-zinc-800/50 transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-[#eafd66]/30"
        aria-expanded={isOpen}
      >
        <span className="text-gray-400 group-hover:text-white transition-colors duration-200 font-medium">
          {qa.question}
        </span>
        <svg
          className={`w-5 h-5 text-zinc-600 group-hover:text-[#eafd66] transition-all duration-300 ${
            isOpen ? 'rotate-180 text-[#eafd66]' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 border-t border-zinc-700/30">
          <p className="text-gray-300 leading-relaxed mt-2">{qa.answer}</p>
        </div>
      </div>
    </div>
  );
}

interface InteractiveQASectionProps {
  qaList: QAItem[];
  title?: string;
  showMore?: boolean;
  maxInitialItems?: number;
  className?: string;
}

export function InteractiveQASection({
  qaList,
  title,
  showMore = true,
  maxInitialItems = 3,
  className = '',
}: InteractiveQASectionProps) {
  const { t } = useTranslation('content');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  if (!qaList || qaList.length === 0) {
    return null;
  }

  const displayItems = showAll ? qaList : qaList.slice(0, maxInitialItems);
  const hasMoreItems = qaList.length > maxInitialItems;

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Title */}
      <h3 className="text-lg font-semibold text-white mb-4">{title || t('interactiveQA.title')}</h3>

      {/* Q&A Items */}
      <div className="space-y-3">
        {displayItems.map((qa, index) => (
          <InteractiveQAItem
            key={index}
            qa={qa}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>

      {/* Show More Button */}
      {showMore && hasMoreItems && !showAll && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(true)}
            className="text-[#eafd66] hover:text-[#eafd66]/80 font-small transition-colors duration-200"
          >
            {t('interactiveQA.showMore')}
          </button>
        </div>
      )}

      {/* Show Less Button */}
      {showMore && showAll && hasMoreItems && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(false)}
            className="text-[#eafd66] hover:text-[#eafd66]/80 font-small transition-colors duration-200"
          >
            {t('interactiveQA.showLess')}
          </button>
        </div>
      )}

      {/* AI Disclaimer */}
      <div className="text-center pt-2">
        <p className="text-zinc-500 text-sm">{t('interactiveQA.disclaimer')}</p>
      </div>
    </div>
  );
}
