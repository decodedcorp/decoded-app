import { ApiResponse } from "@/lib/api/types/response";
import {
  ImageDetails,
  DecodedItem,
  ProcessedImageData,
} from "@/lib/api/types/image";

export async function getImageDetails(
  imageId: string
): Promise<ProcessedImageData | null> {
  try {
    const SERVICE_ENDPOINT = process.env.NEXT_PUBLIC_SERVICE_ENDPOINT;

    if (!SERVICE_ENDPOINT) {
      throw new Error("Missing `SERVICE_ENDPOINT` configuration");
    }

    const response = await fetch(`${SERVICE_ENDPOINT}/image/${imageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image details: ${response.statusText}`);
    }

    const result = (await response.json()) as ApiResponse<ImageDetails>;

    if (result.status_code === 200 && result.data?.image) {
      const imageData = result.data.image;
      return {
        ...imageData,
        items: Object.values(imageData.items || {})
          .flat()
          .filter((item): item is DecodedItem => {
            return Boolean(item?.item?.item);
          }),
      };
    }

    throw new Error("Invalid response structure");
  } catch (error) {
    console.error("Error fetching image details:", error);
    return null;
  }
}
