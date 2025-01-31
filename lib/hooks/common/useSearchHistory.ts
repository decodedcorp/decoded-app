"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/features/auth/useAuth";
import { networkManager } from "@/lib/network/network";

interface SearchHistory {
  keyword: string;
  timestamp: number;
}

const STORAGE_KEY = "SEARCH_HISTORY";
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const { isLogin } = useAuth();

  const loadLocalHistory = () => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load search history:", error);
      return [];
    }
  };

  // const loadServerHistory = async () => {
  //   if (!isLogin) return [];

  //   try {
  //     const response = await networkManager.request("search/history", "GET");
  //     return response.data.history;
  //   } catch (error) {
  //     console.error("Failed to fetch search history:", error);
  //     return [];
  //   }
  // };

  // 검색 기록 추가
  const addToHistory = async (keyword: string) => {
    const newEntry = {
      keyword,
      timestamp: Date.now(),
    };

    // 로컬 스토리지 업데이트
    const updatedHistory = [newEntry, ...history]
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.keyword === item.keyword)
      )
      .slice(0, MAX_HISTORY);

    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    // if (isLogin) {
    //   try {
    //     await fetch("/api/search/history", {
    //       method: "POST",
    //       body: JSON.stringify({ keyword }),
    //     });
    //   } catch (error) {
    //     console.error("Failed to save search history:", error);
    //   }
    // }
  };

  // 검색 기록 삭제
  const clearHistory = async () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);

    if (isLogin) {
      try {
        await fetch("/api/search/history", { method: "DELETE" });
      } catch (error) {
        console.error("Failed to clear search history:", error);
      }
    }
  };

  // 초기 로드
  useEffect(() => {
    const initializeHistory = async () => {
      // if (isLogin) {
      //   const serverHistory = await loadServerHistory();
      //   if (serverHistory?.length > 0) {
      //     setHistory(serverHistory);
      //   } else {
      //     const localHistory = loadLocalHistory();
      //     setHistory(localHistory);
      //   }
      // } else {
      //   const localHistory = loadLocalHistory();
      //   setHistory(localHistory);
      // }
      const localHistory = loadLocalHistory();
      setHistory(localHistory);
    };

    initializeHistory();
  }, [isLogin]);

  return {
    history,
    addToHistory,
    clearHistory,
  };
}
