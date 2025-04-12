import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { mypageService } from "@/lib/api/requests/mypage";
import type { AccountData } from "@/components/Header/nav/modal/types/mypage";

// 기본 데이터 구조 정의
const defaultAccountData: AccountData = {
  points: 0,
  active_ticket_num: 0,
  request_num: 0,
  provide_num: 0,
  pending_num: 0,
};

/**
 * 사용자 계정 데이터를 가져오는 훅
 * @param isOpen 모달이 열려있는지 여부
 * @returns 계정 데이터 및 로딩 상태
 */
export function useAccountData(isOpen: boolean) {
  const { isLogin, isInitialized } = useAuth();
  const queryClient = useQueryClient();
  const [userDocId, setUserDocId] = useState<string | null>(() => {
    // 초기 상태 설정 시 즉시 세션 스토리지에서 값을 가져옴
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("USER_DOC_ID");
    }
    return null;
  });

  // 로그인 상태 변경 감지
  useEffect(() => {
    if (isInitialized) {
      const docId = sessionStorage.getItem("USER_DOC_ID");

      if (isLogin && docId) {
        setUserDocId(docId);
        queryClient.invalidateQueries({ queryKey: ["account-data"] });
      } else if (!isLogin) {
        setUserDocId(null);
      }
    }
  }, [isLogin, isInitialized, queryClient]);

  // 모달이 열릴 때마다 userDocId를 다시 확인
  useEffect(() => {
    if (isOpen) {
      const docId = sessionStorage.getItem("USER_DOC_ID");

      if (docId) {
        setUserDocId(docId);
        queryClient.invalidateQueries({ queryKey: ["account-data"] });
      }
    }
  }, [isOpen, queryClient]);

  return useQuery({
    queryKey: ["account-data", userDocId],
    queryFn: async () => {
      if (!userDocId) {
        // 로그인 정보가 없는 경우 기본 데이터 반환
        return defaultAccountData;
      }

      try {
        // mypageService를 사용하여 데이터 가져오기
        const response = await mypageService.getUserHome(userDocId);

        // API 응답 데이터 확인 후 반환
        return response?.data || defaultAccountData;
      } catch (error) {
        // 오류 발생 시 기본 데이터 반환
        console.error("[useAccountData] 데이터 가져오기 오류:", error);
        return defaultAccountData;
      }
    },
    enabled: isOpen && isInitialized && !!userDocId,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}
