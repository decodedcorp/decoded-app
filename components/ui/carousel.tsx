import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { MainImageInfo } from "@/types/model";
import useEmblaCarousel from "embla-carousel-react";
import EmblaCarousel, { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { main_font, secondary_font } from "../helpers/util";
import Link from "next/link";

const Carousel = ({ images }: { images: MainImageInfo[] | null }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);
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

  return (
    <div className="relative pb-5">
      <button
        onClick={handlePrev}
        className="absolute left-0 top-[calc(50%-24px)] z-[1] flex h-[48px] w-[48px] items-center justify-center bg-white border border-black rounded-md"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-[calc(50%-24px)] z-[1] flex h-[48px] w-[48px] items-center justify-center bg-white border border-black rounded-md"
      >
        &gt;
      </button>
      <div className="embla overflow-hidden max-w-full" ref={emblaRef}>
        <div className="embla__container flex">
          {images?.slice(0, 6).map((image, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center">
              <Link
                href={`images?imageId=${
                  image.docId
                }&imageUrl=${encodeURIComponent(image.imageUrl)}`}
                className="embla__slide relative flex-grow-0 flex-shrink-0 w-96 h-[500px] m-2"
                key={index}
              >
                <Image
                  src={image.imageUrl}
                  alt="carousel image"
                  fill={true}
                  className="rounded-xl border border-black"
                  style={{ objectFit: "cover" }}
                />
              </Link>
              {selectedIndex === index && (
                <div>
                  <p className={`${secondary_font.className} text-xl`}>ITEMS</p>
                  {Array.from(image.itemInfoList.entries())
                    .slice(0, 3)
                    .map(([item, brands], mapIndex) => (
                      <div
                        key={mapIndex}
                        className="flex flex-col lg:flex-row items-center bg-[#f6f6f6] rounded-lg p-2 mt-2 border border-black"
                      >
                        <Link
                          href={item.affiliateUrl ?? ""}
                          className="w-[200px] h-[100px] relative rounded-lg"
                        >
                          <Image
                            src={item.imageUrl ?? ""}
                            alt={item.name ?? ""}
                            fill={true}
                            style={{ objectFit: "cover" }}
                            className="rounded-lg"
                          />
                        </Link>
                        <div className="flex flex-col m-5 w-full lg:block items-center">
                          <div
                            className={`flex ${secondary_font.className} text-xs`}
                          >
                            {brands && brands.length > 0 && (
                              <div className="flex items-center space-x-2 w-full justify-center lg:justify-start">
                                <Image
                                  src={brands[0].logoImageUrl ?? ""}
                                  alt={brands[0].name}
                                  className="rounded-full w-6 h-6 border border-black-opacity-50"
                                  width={100}
                                  height={100}
                                />
                                <div className="rounded-lg p-1 text-md">
                                  {brands[0].name
                                    .replace(/_/g, " ")
                                    .toUpperCase()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  <Link
                    href={`images?imageId=${
                      image.docId
                    }&imageUrl=${encodeURIComponent(image.imageUrl)}`}
                  >
                    <p
                      className={`text-md bg-[#FF204E] text-white rounded-lg p-2 text-center font-bold ${main_font.className} mt-2`}
                    >
                      View More
                    </p>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
