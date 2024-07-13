"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FirebaseHelper } from "@/common/firebase";
import { ArtistInfo, ItemInfo, ImageInfo } from "@/types/model";
import { sha256 } from "js-sha256";

interface BrandInfo {
  category: string;
  creativeDirector: string[];
  logoImageUrl: string;
  name: string;
  websiteUrl: string;
}

function ArtistPage() {
  const searchParams = useSearchParams();
  const encode = searchParams.get("name") ?? "";
  const [artistName, setArtistName] = useState<string | null>(null);
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [brandInfo, setBrandInfo] = useState<BrandInfo[]>([]);
  const [imageInfo, setImageInfo] = useState<string[]>([]);
  const [itemInfo, setItemInfo] = useState<string[]>([]);
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

        // Fetch brand info
        if (artist.tags?.brands) {
          const brands = await FirebaseHelper.listAllStorageItems("brand");
          const brandDetails = brands.items
            .filter((brand) => artist.tags?.brands.includes(brand.id))
            .map((brand) => ({
              category: brand.category,
              creativeDirector: brand.creativeDirector,
              logoImageUrl: brand.logoImageUrl,
              name: brand.name,
              websiteUrl: brand.websiteUrl,
            }));
          setBrandInfo(brandDetails);
        }

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
          const items = await FirebaseHelper.listAllStorageItems("items");
          const itemDetails = items.items
            .filter((item) => artist.tags?.items.includes(item.id))
            .map((item) => item.brand);
          setItemInfo(itemDetails);
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
    <div>
      <h1>
        {artistInfo.name["en"]} ({artistInfo.name["ko"]})
      </h1>
      {artistInfo.also_known_as && (
        <p>Also known as: {artistInfo.also_known_as.join(", ")}</p>
      )}
      {artistInfo.group && <p>Group: {artistInfo.group}</p>}
      {artistInfo.sns && (
        <div>
          <h2>Social Media</h2>
          <ul>
            {Object.entries(artistInfo.sns).map(([platform, url]) => (
              <li key={platform}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {artistInfo.tags && (
        <div>
          <h2>Tags</h2>
          <ul>
            {Object.entries(artistInfo.tags).map(([tag, values]) => (
              <li key={tag}>
                {tag}: {values.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
      {brandInfo.length > 0 && (
        <div>
          <h2>Brands</h2>
          <ul>
            {brandInfo.map((brand) => (
              <li key={brand.name}>
                <img
                  src={brand.logoImageUrl}
                  alt={brand.name}
                  width={50}
                  height={50}
                />
                <p>{brand.name}</p>
                <p>Category: {brand.category}</p>
                <p>Creative Director: {brand.creativeDirector.join(", ")}</p>
                <a
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {imageInfo.length > 0 && (
        <div>
          <h2>Images</h2>
          <ul>
            {imageInfo.map((url, index) => (
              <li key={index}>
                <img src={url} alt={`Image ${index + 1}`} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {itemInfo.length > 0 && (
        <div>
          <h2>Items</h2>
          <ul>
            {itemInfo.map((brand, index) => (
              <li key={index}>{brand}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ArtistPage;
