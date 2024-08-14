import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { MainImage } from "@/types/model";
import useEmblaCarousel from "embla-carousel-react";
import EmblaCarousel, { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { regular_font } from "@/components/helpers/util";

const Carousel = ({ images }: { images: MainImage[] | null }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    ]
  );
  const selectedScrollSnap = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (emblaApi) emblaApi.on("slidesInView", selectedScrollSnap);
  }, [emblaApi, selectedScrollSnap]);

  const handlePrev = () => {
    emblaApi?.scrollPrev();
  };

  const handleNext = () => {
    emblaApi?.scrollNext();
  };

  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null
  );

  return (
    <div className="relative">
      <button
        onClick={handlePrev}
        className="absolute left-0 top-[calc(50%-24px)] z-[1] flex h-[48px] w-[48px] items-center justify-center text-white font-bold"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-[calc(50%-24px)] z-[1] flex h-[48px] w-[48px] items-center justify-center text-white font-bold"
      >
        &gt;
      </button>
      <div className="embla overflow-hidden max-w-full" ref={emblaRef}>
        <div className="embla__container flex">
          {images?.slice(0, 10).map((image, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center">
              <Link
                href={`images?imageId=${
                  image.docId
                }&imageUrl=${encodeURIComponent(image.imageUrl)}&isFeatured=no`}
                className="embla__slide relative w-80 md:w-96 h-[500px]"
                key={index}
              >
                <div
                  className="relative flex flex-row w-full h-full"
                  onMouseEnter={() => setHoveredImageIndex(index)}
                  onMouseLeave={() => setHoveredImageIndex(null)}
                >
                  <Image
                    src={image.imageUrl}
                    alt="carousel image"
                    fill={true}
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                  />
                  {hoveredImageIndex === index && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <p
                        className={`${regular_font.className} px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors text-sm`}
                      >
                        아이템 둘러보기
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
