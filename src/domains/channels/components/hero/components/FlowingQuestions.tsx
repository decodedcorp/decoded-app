'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';

import styles from '../ChannelHero.module.css';
import { FlowingQuestionsProps, Question } from '../types';

export function FlowingQuestions({ 
  className = '', 
  maxRows = 3, 
  animationSpeed = 'normal',
  questions: customQuestions
}: FlowingQuestionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoized questions with categories
  const questions: Question[] = useMemo(() => 
    customQuestions || [
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
    ],
    [customQuestions]
  );

  // Animation speed configuration
  const speedConfig = useMemo(() => ({
    slow: { baseDuration: 12, randomRange: 6 },
    normal: { baseDuration: 8, randomRange: 4 },
    fast: { baseDuration: 5, randomRange: 2 }
  }), []);

  // Create question element with proper typing
  const createQuestionElement = useCallback((question: Question, index: number, row: number) => {
    const element = document.createElement('div');
    element.className = styles.flowingQuestion;
    element.textContent = question.text;
    
    // Set data attributes for better tracking
    element.setAttribute('data-question-id', question.id);
    element.setAttribute('data-category', question.category);
    element.setAttribute('data-row', row.toString());
    
    // Calculate animation properties
    const topPosition = 10 + (row * 20) + (Math.random() * 10);
    const delay = (index * 0.3) + (row * 2);
    const { baseDuration, randomRange } = speedConfig[animationSpeed];
    const duration = baseDuration + Math.random() * randomRange;
    
    // Set CSS custom properties
    element.style.setProperty('--delay', `${delay}s`);
    element.style.setProperty('--duration', `${duration}s`);
    element.style.setProperty('--top', `${topPosition}%`);
    element.style.setProperty('--speed', `${0.5 + Math.random() * 0.5}`);
    
    return element;
  }, [speedConfig, animationSpeed]);

  // Initialize flowing questions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const questionElements: HTMLDivElement[] = [];
    
    // Create multiple rows of questions for continuous flow
    for (let row = 0; row < maxRows; row++) {
      questions.forEach((question, index) => {
        // Original question
        questionElements.push(createQuestionElement(question, index, row));
        
        // Duplicate for seamless loop
        questionElements.push(createQuestionElement(question, index + questions.length, row));
      });
    }

    // Append all elements
    questionElements.forEach(element => {
      container.appendChild(element);
    });

    // Cleanup function
    return () => {
      questionElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [questions, maxRows, createQuestionElement]);

  // Accessibility: Screen reader description
  const screenReaderDescription = useMemo(() => 
    `Flowing background questions about lifestyle, entertainment, wellness, and culture. ${maxRows} rows of questions are continuously moving across the screen.`,
    [maxRows]
  );

  return (
    <div 
      className={`${styles.flowingQuestionsContainer} ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <div 
        ref={containerRef} 
        className={styles.flowingQuestions}
        aria-label={screenReaderDescription}
      />
    </div>
  );
}
