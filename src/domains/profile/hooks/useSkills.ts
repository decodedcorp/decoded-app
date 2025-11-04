import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skill, SkillFormData } from '../types/skills';
import {
  getSkillsFromStorage,
  saveSkillToStorage,
  deleteSkillFromStorage,
  getBrowseSkillsFromStorage,
} from './useSkillsStorage';
import { useAuthStore } from '@/store/authStore';
import { queryKeys } from '@/lib/api/queryKeys';

/**
 * 현재 사용자의 skills 조회 hook
 */
export const useSkills = (userId?: string) => {
  const currentUser = useAuthStore((state) => state.user);
  const targetUserId = userId || currentUser?.doc_id || '';

  return useQuery({
    queryKey: queryKeys.users.skills(targetUserId),
    queryFn: () => {
      const skills = getSkillsFromStorage(targetUserId);
      return { skills, total: skills.length };
    },
    enabled: !!targetUserId,
    staleTime: 30 * 1000, // 30초
  });
};

/**
 * Skill 생성 hook
 */
export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.doc_id || '';

  return useMutation({
    mutationFn: async (data: SkillFormData): Promise<Skill> => {
      const newSkill: Skill = {
        id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        prompt: data.prompt,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      saveSkillToStorage(userId, newSkill);
      return newSkill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.skills(userId) });
    },
  });
};

/**
 * Skill 수정 hook
 */
export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.doc_id || '';

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SkillFormData }): Promise<Skill> => {
      const existingSkills = getSkillsFromStorage(userId);
      const existing = existingSkills.find((s) => s.id === id);
      
      if (!existing) {
        throw new Error('Skill not found');
      }

      const updatedSkill: Skill = {
        ...existing,
        title: data.title,
        prompt: data.prompt,
        updatedAt: new Date(),
      };

      saveSkillToStorage(userId, updatedSkill);
      return updatedSkill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.skills(userId) });
    },
  });
};

/**
 * Skill 삭제 hook
 */
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.doc_id || '';

  return useMutation({
    mutationFn: async (skillId: string): Promise<void> => {
      deleteSkillFromStorage(userId, skillId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.skills(userId) });
    },
  });
};

/**
 * 다른 사용자들의 skills 탐색 hook (목업)
 */
export const useSkillsBrowse = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['skills', 'browse', searchQuery],
    queryFn: () => {
      const allSkills = getBrowseSkillsFromStorage();
      
      if (!searchQuery?.trim()) {
        return { skills: allSkills, total: allSkills.length };
      }

      const query = searchQuery.toLowerCase().trim();
      const filtered = allSkills.filter(
        (skill) =>
          skill.title.toLowerCase().includes(query) ||
          skill.prompt.toLowerCase().includes(query),
      );

      return { skills: filtered, total: filtered.length };
    },
    staleTime: 60 * 1000, // 1분
  });
};

