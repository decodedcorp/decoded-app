"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FirebaseHelper } from "@/common/firebase";
import { FeaturedInfo } from "@/types/model.d";
import { HeroBanner } from "../../layouts/hero-banner";

export function HeroCarousel() {
  const [featured, setFeatured] = useState<FeaturedInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      containScroll: "keepSnaps",
      dragFree: false,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    ]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const docs = await FirebaseHelper.docs("featured");
      const featuredInfoList: FeaturedInfo[] = [];
      docs.forEach((doc) => {
        let featuredData = doc.data() as FeaturedInfo;
        featuredData.docId = doc.id;
        featuredInfoList.push(featuredData);
        featuredInfoList.push(featuredData);
      });
      setFeatured(featuredInfoList);
    };
    fetchFeatured();
  }, []);

  if (featured.length === 0) return null;

  return (
    <div className="overflow-hidden max-w-full" ref={emblaRef}>
      <div className="flex">
        {featured?.map((f, index) => (
          <HeroBanner
            key={index}
            imageUrl={f.imageUrl}
            category={f.category}
            title={f.title}
            docId={f.docId}
            isActive={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}