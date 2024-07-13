"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FirebaseHelper } from "@/common/firebase";
import { ArtistInfo, ItemInfo, ImageInfo } from "@/types/model";
import { sha256 } from "js-sha256";

interface ItemInfoWithImage {
  id: string;
  imageUrl: string;
  name: string;
}

function ArtistPage() {
  const searchParams = useSearchParams();
  const encode = searchParams.get("name") ?? "";
  const [artistName, setArtistName] = useState<string | null>(null);
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageInfo, setImageInfo] = useState<string[]>([]);
  const [itemInfo, setItemInfo] = useState<ItemInfoWithImage[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!encode) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    setArtistName(decodeURIComponent(encode));
  }, [encode]);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      if (!artistName) return;
      setIsLoading(true);
      const artistDocId = sha256(artistName);
      const artistDoc = await FirebaseHelper.doc("artists", artistDocId);
      if (artistDoc.exists) {
        const artist = artistDoc.data() as ArtistInfo;
        setArtistInfo(artist);

        // 콘솔에 artist.tags?.items 출력
        console.log("artist.tags?.items:", artist.tags?.items);

        // Fetch image info
        if (artist.tags?.images) {
          const images = await FirebaseHelper.listAllStorageItems("images");
          const imageDetails = images.items
            .filter((image) => artist.tags?.images.includes(image.id))
            .map((image) => image.mainImageUrl);
          setImageInfo(imageDetails);
        }

        // Fetch item info
        if (artist.tags?.items) {
          const itemDetails = await Promise.all(
            artist.tags.items.map(async (itemId) => {
              const itemDoc = await FirebaseHelper.doc("items", itemId);
              if (itemDoc.exists) {
                const itemData = itemDoc.data();
                console.log("item.data():", itemData);
                return {
                  id: itemId,
                  imageUrl: itemData.imageUrl,
                  name: itemData.name,
                };
              } else {
                console.log(`No such document for item ID: ${itemId}`);
                return null;
              }
            })
          );
          setItemInfo(
            itemDetails.filter((item) => item !== null) as ItemInfoWithImage[]
          );
        }
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    };

    fetchArtistInfo();
  }, [artistName]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (notFound) {
    return <div>Artist not found</div>;
  }

  if (!artistInfo) {
    return <div>Artist not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">
        {artistInfo.name["en"]} ({artistInfo.name["ko"]})
      </h1>
      {artistInfo.also_known_as && (
        <p className="mb-4">
          Also known as: {artistInfo.also_known_as.join(", ")}
        </p>
      )}
      {artistInfo.group && <p className="mb-4">Group: {artistInfo.group}</p>}
      {artistInfo.sns && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Social Media</h2>
          <div className="flex space-x-4">
            {artistInfo.sns["instagram"] && (
              <a
                href={artistInfo.sns["instagram"]}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition"
              >
                Instagram
              </a>
            )}
            {artistInfo.sns["youtube"] && (
              <a
                href={artistInfo.sns["youtube"]}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
              >
                YouTube
              </a>
            )}
            {/* 다른 SNS 플랫폼도 추가 가능 */}
          </div>
        </div>
      )}
      {imageInfo.length > 0 && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Images</h2>
          <ul className="grid grid-cols-3 gap-4">
            {imageInfo.map((url, index) => (
              <li key={index}>
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {itemInfo.length > 0 && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Items</h2>
          <ul className="grid grid-cols-3 gap-4">
            {itemInfo.map((item) => (
              <li key={item.id}>
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <img
                  src={item.imageUrl}
                  alt={`Item ${item.id}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ArtistPage;
