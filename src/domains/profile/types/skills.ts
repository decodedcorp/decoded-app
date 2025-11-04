/**
 * Skill 인터페이스
 * 사용자 프롬프트를 저장하고 관리하는 구조
 */
export interface Skill {
  /** 고유 식별자 */
  id: string;
  /** 커맨드로 사용되는 타이틀 (예: "fact-check", "color-analysis") */
  title: string;
  /** 프롬프트 본문 */
  prompt: string;
  /** 소유자 사용자 ID (나중에 API 연동 시 사용) */
  userId: string;
  /** 생성일 */
  createdAt: Date;
  /** 수정일 */
  updatedAt: Date;
}

/**
 * Skill 생성/수정을 위한 DTO
 */
export interface SkillFormData {
  title: string;
  prompt: string;
}

/**
 * Skill 목록 조회 응답 (목업용)
 */
export interface SkillsResponse {
  skills: Skill[];
  total: number;
}

