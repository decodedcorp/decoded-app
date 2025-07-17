'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 이미지 상세 정보 타입 (실제 API 응답 구조와 유사하게 정의)
interface ImageDetails {
  id: number;
  type: string;
  description?: string;
  src: string;
  tags: string[];
  // 필요한 다른 필드들 추가 가능
}

// 더미 데이터 컨텍스트 타입
interface DummyDataContext {
  imageDetails: ImageDetails | null;
  isLoading: boolean;
  error: Error | null;
  relatedItems: any[] | null;
}

// 컨텍스트 생성
const DummyDataContext = createContext<DummyDataContext>({
  imageDetails: null,
  isLoading: true,
  error: null,
  relatedItems: null
});

// 더미 데이터 제공자 Props
interface DummyDataProviderProps {
  children: ReactNode;
  imageId: string | number;
}

export function DummyDataProvider({ children, imageId }: DummyDataProviderProps) {
  const [state, setState] = useState<DummyDataContext>({
    imageDetails: null,
    isLoading: true,
    error: null,
    relatedItems: null
  });

  // 더미 데이터 로드
  useEffect(() => {
    const loadDummyData = async () => {
      try {
        // 데이터 로드 시작
        setState(prev => ({ ...prev, isLoading: true }));
        
        // public 폴더의 data.json 파일에서 데이터 가져오기
        const response = await fetch('/details-renewal/data.json');
        
        if (!response.ok) {
          throw new Error(`더미 데이터 로드 실패: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // 요청된 ID와 일치하는 아이템 찾기 또는 첫 번째 아이템 사용
        const numericId = Number(imageId);
        const selectedItem = data.items.find((item: any) => item.id === numericId) || data.items[0];
        
        // 관련 아이템 (나머지 아이템들)
        const relatedItems = data.items.filter((item: any) => item.id !== numericId);
        
        // 이미지 상세 정보 포맷
        const imageDetails: ImageDetails = {
          id: selectedItem.id,
          type: selectedItem.type,
          src: selectedItem.src || '',
          tags: selectedItem.tags || [],
          description: `더미 설명 텍스트입니다. 아이템 ${selectedItem.id}에 대한 상세 설명이 여기에 표시됩니다.`
        };
        
        // 상태 업데이트
        setState({
          imageDetails,
          isLoading: false,
          error: null,
          relatedItems
        });
        
      } catch (error) {
        console.error('더미 데이터 로드 오류:', error);
        setState({
          imageDetails: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다'),
          relatedItems: null
        });
      }
    };
    
    loadDummyData();
  }, [imageId]);

  return (
    <DummyDataContext.Provider value={state}>
      {children}
    </DummyDataContext.Provider>
  );
}

// 사용자 정의 훅 (더미 데이터 사용)
export function useDummyData() {
  const context = useContext(DummyDataContext);
  
  if (context === undefined) {
    throw new Error('useDummyData는 DummyDataProvider 내에서 사용해야 합니다');
  }
  
  return context;
} 