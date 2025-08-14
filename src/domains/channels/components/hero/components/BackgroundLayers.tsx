'use client';

import React from 'react';
import styles from '../ChannelHero.module.css';
import { BackgroundLayersProps } from '../types';

export function BackgroundLayers({ layers, className = '' }: BackgroundLayersProps) {
  return (
    <>
      {/* Background Frame */}
      <div className={`${styles.backgroundFrame} ${className}`} aria-hidden="true" />

      {/* Background Image Layers */}
      {layers.map((layer) => (
        <div
          key={layer.id}
          id={`${layer.id}-bg`}
          className={`${styles.backgroundImage} ${layer.className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
