"use client";

import { HoverItem, ItemDocument, ProvideData } from "@/types/model.d";
import { networkManager } from "@/lib/network/network";

interface UseLinkFormSubmit {
  handleSubmit: (provideData: ProvideData | null) => Promise<boolean>;
}

export function useLinkFormSubmit(
  item: HoverItem,
  itemDocument: ItemDocument
): UseLinkFormSubmit {
  const handleSubmit = async (
    provideData: ProvideData | null
  ): Promise<boolean> => {
    if (!provideData) {
      alert("정보를 입력해주세요.");
      return false;
    }

    const providerId = sessionStorage.getItem("USER_DOC_ID");
    if (!providerId) {
      alert("로그인이 필요합니다.");
      return false;
    }
    const userDocId = sessionStorage.getItem("USER_DOC_ID");
    try {
      await networkManager.request(
        `user/${userDocId}/image/${item.imageDocId}/provide/item/${itemDocument.Id}`,
        "POST",
        { ...provideData, provider: providerId }
      );
      alert("제공 요청이 완료되었습니다.");
      return true;
    } catch (err) {
      alert("제공 요청에 실패하였습니다.");
      return false;
    }
  };

  return { handleSubmit };
}
