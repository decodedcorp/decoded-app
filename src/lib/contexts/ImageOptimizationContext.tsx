'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { ImageQuality, ImageSize } from '@/lib/utils/imageProxy';

interface NetworkConnection {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface ImageOptimizationConfig {
  defaultQuality: ImageQuality;
  defaultSize: ImageSize;
  enableProgressive: boolean;
  enablePreloading: boolean;
  maxConcurrentLoads: number;
  networkOptimization: boolean;
}

interface ImageOptimizationContextType {
  config: ImageOptimizationConfig;
  networkInfo: NetworkConnection | null;
  updateConfig: (newConfig: Partial<ImageOptimizationConfig>) => void;
  getOptimalSettings: (containerWidth?: number) => {
    quality: ImageQuality;
    size: ImageSize;
    progressive: boolean;
  };
}

const ImageOptimizationContext = createContext<ImageOptimizationContextType | null>(null);

interface ImageOptimizationProviderProps {
  children: ReactNode;
  initialConfig?: Partial<ImageOptimizationConfig>;
}

const defaultConfig: ImageOptimizationConfig = {
  defaultQuality: 'medium',
  defaultSize: 'medium',
  enableProgressive: true,
  enablePreloading: true,
  maxConcurrentLoads: 3,
  networkOptimization: true,
};

export const ImageOptimizationProvider: React.FC<ImageOptimizationProviderProps> = ({
  children,
  initialConfig = {},
}) => {
  const [config, setConfig] = useState<ImageOptimizationConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  
  const [networkInfo, setNetworkInfo] = useState<NetworkConnection | null>(null);

  useEffect(() => {
    // 네트워크 정보 감지
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 100,
          saveData: connection.saveData || false,
        });
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  // 네트워크 상태에 따른 자동 최적화
  useEffect(() => {
    if (!networkInfo || !config.networkOptimization) return;

    let newConfig: Partial<ImageOptimizationConfig> = {};

    // 저속 네트워크 감지
    if (networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
      newConfig = {
        defaultQuality: 'low',
        defaultSize: 'small',
        enableProgressive: true,
        maxConcurrentLoads: 1,
      };
    } else if (networkInfo.effectiveType === '3g') {
      newConfig = {
        defaultQuality: 'low',
        defaultSize: 'medium',
        enableProgressive: true,
        maxConcurrentLoads: 2,
      };
    } else if (networkInfo.effectiveType === '4g') {
      newConfig = {
        defaultQuality: 'medium',
        defaultSize: 'large',
        enableProgressive: false,
        maxConcurrentLoads: 3,
      };
    }

    // 데이터 절약 모드
    if (networkInfo.saveData) {
      newConfig.defaultQuality = 'low';
      newConfig.defaultSize = 'small';
      newConfig.enablePreloading = false;
      newConfig.maxConcurrentLoads = 1;
    }

    setConfig(prev => ({ ...prev, ...newConfig }));
  }, [networkInfo, config.networkOptimization]);

  const updateConfig = (newConfig: Partial<ImageOptimizationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const getOptimalSettings = (containerWidth?: number) => {
    let { defaultQuality: quality, defaultSize: size, enableProgressive: progressive } = config;

    // 컨테이너 크기에 따른 사이즈 조정
    if (containerWidth) {
      if (containerWidth <= 200) {
        size = 'thumb';
      } else if (containerWidth <= 400) {
        size = 'small';
      } else if (containerWidth <= 800) {
        size = 'medium';
      } else {
        size = 'large';
      }
    }

    // 네트워크 상태에 따른 추가 최적화
    if (networkInfo && config.networkOptimization) {
      if (networkInfo.downlink < 1.5) {
        quality = 'low';
        progressive = true;
      }

      if (networkInfo.rtt > 1000) {
        progressive = true;
      }
    }

    return { quality, size, progressive };
  };

  return (
    <ImageOptimizationContext.Provider
      value={{
        config,
        networkInfo,
        updateConfig,
        getOptimalSettings,
      }}
    >
      {children}
    </ImageOptimizationContext.Provider>
  );
};

export const useImageOptimization = () => {
  const context = useContext(ImageOptimizationContext);
  if (!context) {
    throw new Error('useImageOptimization must be used within ImageOptimizationProvider');
  }
  return context;
};

export default ImageOptimizationContext;