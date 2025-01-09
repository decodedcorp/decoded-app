"use client";

import { useEffect, useState } from "react";
import { networkManager } from "@/lib/network/network";
import { ItemSpotCard } from "../components/item-spot-card";

// DO-NOT-DELETE: For future use
// interface TrendingItem {
//     id: string;
//     image: string;
//     title: string;
//     category: string;
//     views: number;
//     requestCount: number;
//     exposureRate: string;
//   }

export function PremiumSpotClient() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingItems() {
      try {
        const res = await networkManager.request(
          "metrics/trending/items",
          "GET"
        );
        console.log("Trending items:", res.data);
      } catch (error) {
        console.error("Error fetching trending items:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingItems();
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <ItemSpotCard
        image="https://placehold.co/400x300"
        title="블랙 크롭 자켓"
        category="패션/의류"
        views={1240}
        requestCount={38}
        exposureRate="320%"
      />
      <ItemSpotCard
        image="https://placehold.co/400x300"
        title="화이트 스니커즈"
        category="신발"
        views={980}
        requestCount={25}
        exposureRate="280%"
        featured
      />
      <ItemSpotCard
        image="https://placehold.co/400x300"
        title="브라운 크로스백"
        category="가방"
        views={850}
        requestCount={19}
        exposureRate="250%"
      />
    </div>
  );
} 