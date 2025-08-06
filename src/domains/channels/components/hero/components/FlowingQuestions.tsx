'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../ChannelHero.module.css';

const questions = [
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
  "What's your preferred learning style?"
];

export function FlowingQuestions() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createQuestionElement = (question: string, index: number, row: number) => {
      const element = document.createElement('div');
      element.className = styles.flowingQuestion;
      element.textContent = question;
      
      // Create multiple rows of flowing questions
      const topPosition = 10 + (row * 20) + (Math.random() * 10);
      const delay = (index * 0.3) + (row * 2);
      const duration = 8 + Math.random() * 4;
      
      element.style.setProperty('--delay', `${delay}s`);
      element.style.setProperty('--duration', `${duration}s`);
      element.style.setProperty('--top', `${topPosition}%`);
      element.style.setProperty('--speed', `${0.5 + Math.random() * 0.5}`);
      
      return element;
    };

    // Create multiple rows of questions for continuous flow
    const questionElements: HTMLDivElement[] = [];
    
    // Create 3 rows of questions
    for (let row = 0; row < 3; row++) {
      questions.forEach((question, index) => {
        questionElements.push(createQuestionElement(question, index, row));
        // Add duplicate for seamless loop
        questionElements.push(createQuestionElement(question, index + questions.length, row));
      });
    }

    questionElements.forEach(element => {
      container.appendChild(element);
    });

    return () => {
      questionElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  return (
    <div className={styles.flowingQuestionsContainer}>
      <div ref={containerRef} className={styles.flowingQuestions}></div>
    </div>
  );
}
