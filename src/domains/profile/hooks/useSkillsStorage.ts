import { Skill } from '../types/skills';

const STORAGE_KEY = 'decoded_skills';
const STORAGE_KEY_BROWSE = 'decoded_skills_browse';

/**
 * 초기 샘플 스킬 생성 (테스트용)
 */
const generateInitialSampleSkills = (userId: string): Skill[] => {
  const now = new Date();
  return [
    {
      id: `skill-${Date.now()}-1`,
      title: 'fact-check',
      prompt: '이 정보의 사실 여부를 확인하고 신뢰할 수 있는 출처를 제공해주세요.',
      userId,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: `skill-${Date.now()}-2`,
      title: 'summarize',
      prompt: '이 내용을 간결하고 명확하게 요약해주세요. 핵심 포인트를 3-5개로 정리해주세요.',
      userId,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: `skill-${Date.now()}-3`,
      title: 'improve-writing',
      prompt: '이 텍스트를 더 명확하고 읽기 쉽게 개선해주세요. 문법과 표현을 수정하고 전체적인 흐름을 개선해주세요.',
      userId,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: `skill-${Date.now()}-4`,
      title: 'explain-concept',
      prompt: '이 개념을 초보자도 이해할 수 있도록 쉽고 명확하게 설명해주세요. 예시를 들어 설명해주세요.',
      userId,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  ];
};

/**
 * 로컬 스토리지에서 사용자의 skills 조회
 * 처음 로드할 때 스킬이 없으면 샘플 스킬을 자동 생성
 */
export const getSkillsFromStorage = (userId: string): Skill[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    
    // 스킬이 없으면 샘플 스킬 생성 및 저장
    if (!stored) {
      const sampleSkills = generateInitialSampleSkills(userId);
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(sampleSkills));
      return sampleSkills;
    }
    
    const skills = JSON.parse(stored);
    // Date 객체로 변환
    return skills.map((skill: any) => ({
      ...skill,
      createdAt: new Date(skill.createdAt),
      updatedAt: new Date(skill.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load skills from storage:', error);
    return [];
  }
};

/**
 * 로컬 스토리지에 skill 저장
 */
export const saveSkillToStorage = (userId: string, skill: Skill): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const skills = getSkillsFromStorage(userId);
    const existingIndex = skills.findIndex((s) => s.id === skill.id);
    
    if (existingIndex >= 0) {
      skills[existingIndex] = skill;
    } else {
      skills.push(skill);
    }
    
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(skills));
  } catch (error) {
    console.error('Failed to save skill to storage:', error);
  }
};

/**
 * 로컬 스토리지에서 skill 삭제
 */
export const deleteSkillFromStorage = (userId: string, skillId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const skills = getSkillsFromStorage(userId);
    const filtered = skills.filter((s) => s.id !== skillId);
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete skill from storage:', error);
  }
};

/**
 * 모든 사용자의 skills 조회 (탐색용 목업 데이터)
 */
export const getBrowseSkillsFromStorage = (): Skill[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_BROWSE);
    if (!stored) {
      // 초기 목업 데이터 생성
      const mockSkills = generateMockBrowseSkills();
      localStorage.setItem(STORAGE_KEY_BROWSE, JSON.stringify(mockSkills));
      return mockSkills;
    }
    
    const skills = JSON.parse(stored);
    return skills.map((skill: any) => ({
      ...skill,
      createdAt: new Date(skill.createdAt),
      updatedAt: new Date(skill.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load browse skills from storage:', error);
    return [];
  }
};

/**
 * 목업 browse skills 생성
 */
const generateMockBrowseSkills = (): Skill[] => {
  const now = new Date();
  const skills: Skill[] = [
    {
      id: 'mock-1',
      title: 'fact-check',
      prompt: '이 정보의 사실 여부를 확인하고 신뢰할 수 있는 출처를 제공해주세요.',
      userId: 'user-1',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'mock-2',
      title: 'color-analysis',
      prompt: '이 이미지의 색상 분석을 해주고, 헤어, 피부, 눈 색상에 맞는 최적의 컬러 매치를 제안해주세요.',
      userId: 'user-2',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'mock-3',
      title: 'best-word',
      prompt: '이 상황에서 가장 적절한 단어나 표현을 추천해주세요.',
      userId: 'user-3',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'mock-4',
      title: 'summarize',
      prompt: '이 내용을 간결하고 명확하게 요약해주세요.',
      userId: 'user-1',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'mock-5',
      title: 'technical',
      prompt: '이 내용을 기술적인 관점에서 분석하고 설명해주세요.',
      userId: 'user-2',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  ];
  
  return skills;
};

