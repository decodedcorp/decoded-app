'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

// Initial categories based on user request and provided image
const initialCategories: Category[] = [
  { id: 'all', name: 'all' },
  { id: 'k-pop', name: 'k-pop' },
  { id: 'actor', name: 'actor' },
  { id: 'everyday', name: 'everyday' },
  { id: 'nature', name: 'nature' },
  { id: 'technology', name: 'technology' },
  { id: 'transport', name: 'transport' },
  // Add more categories as needed
];

interface CategoryFilterProps {
  // onSelectCategory: (categoryId: string) => void; // Placeholder for future implementation
}

export function CategoryFilter({ }: CategoryFilterProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // onSelectCategory(categoryId); // This would be used to actually filter content
    console.log(`Category selected: ${categoryId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const item = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-2 px-4 py-3 justify-start md:justify-center"
    >
      {initialCategories.map((category) => (
        <motion.button
          key={category.id}
          variants={item}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ease-in-out
            ${category.id === selectedCategoryId 
              ? 'bg-white text-black shadow-md'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
        >
          {category.name}
        </motion.button>
      ))}
    </motion.div>
  );
}

// CSS to hide scrollbar (optional, can be in global.css or a style tag)
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }
// .scrollbar-hide {
//   -ms-overflow-style: none;  /* IE and Edge */
//   scrollbar-width: none;  /* Firefox */
// } 