import { useQuery } from "@tanstack/react-query";
import { networkManager } from "@/lib/network/network";
import { CurationContent } from "../types";

async function fetchCurationContents(type: "identity" | "brand" | "context") {
  const response = await networkManager.request<{
    status_code: number;
    description: string;
    data: {
      contents: CurationContent[];
      next_id: string | null;
    };
  }>(`curation/contents?content_type=main_page&curation_type=${type}`, "GET");

  return response?.data.contents;
}

export function useCurationContents(type: "identity" | "brand" | "context") {
  return useQuery({
    queryKey: ["curationContents", type],
    queryFn: () => fetchCurationContents(type),
  });
}
