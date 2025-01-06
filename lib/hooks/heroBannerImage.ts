import { useEffect, useState } from "react";
import { imagesAPI } from "@/lib/api/endpoints/images";
import { ImageData, DecodedItem, ImageMetadata } from "@/lib/api/types/image";

interface ProcessedImage {
  mainImage: {
    doc_id: string;
    img_url: string;
    title: string | null;
    style: string | null;
  };
  itemImages: Array<{
    doc_id: string;
    img_url: string | null;
    title: string | null;
    style: string | null;
    position: {
      top: string;
      left: string;
    };
    item: {
      item: {
        _id: string;
        metadata: ImageMetadata;
        img_url: string | null;
        requester: string;
        requested_at: string;
        link_info: any;
        like: number;
      };
      brand_name: string | null;
      brand_logo_image_url: string | null;
    };
  }>;
}

// 빈 상태인지 확인하는 헬퍼 함수
export function isEmptyBannerState(
  loading: boolean,
  image: ProcessedImage | null
): boolean {
  return loading || !image;
}

function processImage(image: ImageData): ProcessedImage | null {
  // 메인 이미지 URL이 없으면 null 반환
  if (!image.img_url) return null;

  // items 객체의 모든 배열을 하나로 합칩니다
  const allItems = Object.values(image.items).flat();
  console.log("All items:", JSON.stringify(allItems, null, 2));

  // 중복 제거를 위한 Set
  const seenItemIds = new Set<string>();

  // 디코딩된 아이템만 필터링하고 필요한 정보를 매핑
  const decodedItems = allItems
    .filter((item) => {
      console.log("Processing item:", JSON.stringify(item, null, 2));
      if (!item.is_decoded) {
        console.log("Item not decoded:", item.item?.item?._id);
        return false;
      }
      // 이미 처리된 아이템인지 확인
      if (seenItemIds.has(item.item.item._id)) {
        console.log("Duplicate item:", item.item.item._id);
        return false;
      }
      seenItemIds.add(item.item.item._id);
      return true;
    })
    .map((item) => {
      const processedItem = {
        doc_id: image.doc_id,
        img_url: item.item.item.img_url,
        title: item.item.item.metadata.name,
        style: null,
        position: item.position,
        item: {
          item: {
            _id: item.item.item._id,
            metadata: item.item.item.metadata,
            img_url: item.item.item.img_url,
            requester: item.item.item.requester,
            requested_at: item.item.item.requested_at,
            link_info: item.item.item.link_info,
            like: item.item.item.like,
          },
          brand_name: item.item.brand_name,
          brand_logo_image_url: item.item.brand_logo_image_url,
        },
      };
      console.log("Processed item:", JSON.stringify(processedItem, null, 2));
      return processedItem;
    });

  console.log("Final decoded items:", JSON.stringify(decodedItems, null, 2));

  // 메인 이미지는 있지만 아이템이 없어도 반환
  return {
    mainImage: {
      doc_id: image.doc_id,
      img_url: image.img_url,
      title: image.title,
      style: image.style,
    },
    itemImages: decodedItems,
  };
}

export function useHeroBannerImage() {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await imagesAPI.getImages();
        const images = response.data.images;

        if (images && images.length > 0) {
          // 이미지를 처리하고 유효한 이미지만 필터링
          const validImages = images
            .map(processImage)
            .filter((img): img is ProcessedImage => img !== null);

          // 랜덤하게 하나의 이미지를 선택
          const randomImage =
            validImages[Math.floor(Math.random() * validImages.length)];
          setProcessedImage(randomImage);
        } else {
          setProcessedImage(null);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setProcessedImage(null);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  return { processedImage, loading };
}
