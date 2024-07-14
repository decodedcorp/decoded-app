import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { MainImageInfo } from "@/types/model";
import useEmblaCarousel from "embla-carousel-react";
import EmblaCarousel, { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";

const Carousel = ({ images }: { images: MainImageInfo[] | null }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);
  const logSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
    console.log(emblaApi.slidesInView());
  }, []);

  useEffect(() => {
    if (emblaApi) emblaApi.on("slidesInView", logSlidesInView);
  }, [emblaApi, logSlidesInView]);

  return (
    <div
      className="embla overflow-hidden max-w-full bg-red-500 p-10"
      ref={emblaRef}
    >
      <div className="embla__container flex">
        {images?.slice(0, 6).map((image, index) => (
          <div
            className="embla__slide relative flex-grow-0 flex-shrink-0 w-96 h-[500px] m-2"
            key={index}
          >
            <Image
              src={image.imageUrl}
              alt="carousel image"
              fill={true}
              className="rounded-xl"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
