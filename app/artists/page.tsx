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

interface BrandInfo {
  id: string;
  name: string;
  logoImageUrl: string;
}

interface ImageInfoWithUrl extends ImageInfo {
  imageUrl: string;
}

function ArtistPage() {
  const searchParams = useSearchParams();
  const encode = searchParams.get("name") ?? "";
  const [artistName, setArtistName] = useState<string | null>(null);
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageInfo, setImageInfo] = useState<ImageInfoWithUrl[]>([]);
  const [itemInfo, setItemInfo] = useState<ItemInfoWithImage[]>([]);
  const [brandInfo, setBrandInfo] = useState<BrandInfo[]>([]);
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
      if (artistDoc.exists()) {
        const artist = artistDoc.data() as ArtistInfo;
        setArtistInfo(artist);

        // 콘솔에 artist.tags?.items 출력
        console.log("artist.tags?.images:", artist.tags?.images);

        if (artist.tags?.images) {
          const imageDetails = await Promise.all(
            artist.tags.images.map(async (imageId) => {
              try {
                const imageDoc = await FirebaseHelper.doc("images", imageId);
                if (imageDoc.exists()) {
                  const imageData = imageDoc.data() as ImageInfo;
                  const storageRef = FirebaseHelper.storageRef(
                    `images/${imageId}`
                  );
                  const imageUrl = await FirebaseHelper.downloadUrl(storageRef);
                  if (imageData && imageUrl) {
                    console.log(`Image data for ID ${imageId}:`, imageData); // imageData 콘솔 출력
                    return {
                      ...imageData,
                      imageUrl,
                    };
                  } else {
                    console.log(`No data or URL for image ID: ${imageId}`);
                    return null;
                  }
                } else {
                  console.log(`No such document for image ID: ${imageId}`);
                  return null;
                }
              } catch (error) {
                console.error(`Error fetching image ID ${imageId}:`, error);
                return null;
              }
            })
          );
          setImageInfo(
            imageDetails.filter((image) => image !== null) as ImageInfoWithUrl[]
          );
        }

        // Fetch item info
        if (artist.tags?.items) {
          const itemDetails = await Promise.all(
            artist.tags.items.map(async (itemId) => {
              try {
                const itemDoc = await FirebaseHelper.doc("items", itemId);
                if (itemDoc.exists()) {
                  const itemData = itemDoc.data();
                  const storageRef = FirebaseHelper.storageRef(
                    `items/${itemId}`
                  );
                  const imageUrl = await FirebaseHelper.downloadUrl(storageRef);
                  return {
                    id: itemId,
                    imageUrl,
                    name: itemData.name,
                  };
                } else {
                  console.log(`No such document for item ID: ${itemId}`);
                  return null;
                }
              } catch (error) {
                console.error(`Error fetching item ID ${itemId}:`, error);
                return null;
              }
            })
          );
          setItemInfo(
            itemDetails.filter((item) => item !== null) as ItemInfoWithImage[]
          );
        }

        // Fetch brand info
        if (artist.tags?.brands) {
          const brandDetails = await Promise.all(
            artist.tags.brands.map(async (brandId) => {
              try {
                const brandDoc = await FirebaseHelper.doc("brands", brandId);
                if (brandDoc.exists()) {
                  const brandData = brandDoc.data();
                  if (brandData) {
                    console.log("brand.data():", brandData);
                    const storageRef = FirebaseHelper.storageRef(
                      `brands/${brandId}`
                    );
                    try {
                      const logoImageUrl = await FirebaseHelper.downloadUrl(
                        storageRef
                      );
                      return {
                        id: brandId,
                        name: brandData.name,
                        logoImageUrl,
                      };
                    } catch (error) {
                      console.error(
                        `Error fetching logo URL for brand ID ${brandId}:`,
                        error
                      );
                      return {
                        id: brandId,
                        name: brandData.name,
                        logoImageUrl: null, // 로고 이미지가 없는 경우 null로 설정
                      };
                    }
                  } else {
                    console.log(`No data for brand ID: ${brandId}`);
                    return null;
                  }
                } else {
                  console.log(`No such document for brand ID: ${brandId}`);
                  return null;
                }
              } catch (error) {
                console.error(`Error fetching brand ID ${brandId}:`, error);
                return null;
              }
            })
          );
          setBrandInfo(
            brandDetails.filter((brand) => brand !== null) as BrandInfo[]
          );
          console.log(
            "Updated brandInfo:",
            brandDetails.filter((brand) => brand !== null)
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
      <h1 className="text-3xl font-bold mb-4">{artistName}</h1>{" "}
      {/* 쿼리 매개변수로 받은 아티스트 이름을 표시 */}
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
            {imageInfo.map((image) => (
              <li key={image.id}>
                <h3 className="text-xl font-semibold mb-2">{image.title}</h3>
                <img
                  src={image.imageUrl}
                  alt={`Image ${image.id}`}
                  className="w-full h-auto rounded-lg shadow-md"
                  onError={() =>
                    console.log(`Image URL missing for ID ${image.id}`)
                  } // 이미지 URL이 없는 경우 콘솔에 출력
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {itemInfo.length > 0 && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">착용한 아이템</h2>
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
      {brandInfo.length > 0 && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Brands</h2>
          <ul className="grid grid-cols-3 gap-4">
            {brandInfo.map((brand) => (
              <li key={brand.id}>
                <div className="flex items-center space-x-4">
                  <img
                    src={brand.logoImageUrl}
                    alt={brand.name}
                    className="w-16 h-16 rounded-lg shadow-md"
                  />
                  <span className="text-xl font-semibold">{brand.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ArtistPage;
