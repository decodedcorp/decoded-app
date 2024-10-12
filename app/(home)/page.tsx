"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FirebaseHelper } from "../../common/firebase";
import { bold_font, regular_font } from "@/components/helpers/util";
import {
  ImageInfo,
  BrandInfo,
  ArticleInfo,
  ArtistInfo,
  ItemInfo,
  MainImage,
  TaggedItem,
  Position,
  FeaturedInfo,
  PickInfo,
  SpotlightInfo,
  TrendingNowInfo,
  DiscoverInfo,
} from "@/types/model";
import Carousel from "@/components/ui/carousel";
import ProgressBar from "@/components/ui/progress-bar";
import { Button, ImageList, ImageListItem } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  mockPicks,
  mockSpotlight,
  mockTrendingNow,
  mockDiscover,
} from "@/components/helpers/mock";
import { LoadingView } from "@/components/ui/loading";
import Pin from "@/components/ui/pin";

function Home() {
  const [mainImages, setMainImages] = useState<MainImage[] | null>(null);

  return (
    <div className="flex flex-col min-h-[100vh]">
      <FeaturedView />
      <PickView />
      <DiscoverView />
      <TrendingNowView />
    </div>
  );
}

function FeaturedView() {
  const [featured, setFeatured] = useState<FeaturedInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("currentIndex", currentIndex);
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

  const handlePrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  };

  const handleNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      const docs = await FirebaseHelper.docs("featured");
      const featuredInfoList: FeaturedInfo[] = [];
      docs.forEach((doc) => {
        var featuredData = doc.data() as FeaturedInfo;
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
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center p-2 md:p-4 ${
              index === currentIndex ? "opacity-100" : "opacity-20"
            }`}
          >
            <div className="relative w-[100vw] md:w-[90vw] lg:w-[90vw]">
              <div className="aspect-w-3 aspect-h-4 lg:aspect-w-16 lg:aspect-h-9">
                <Image
                  src={f.imageUrl}
                  alt="carousel image"
                  fill={true}
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <Link
                href={`/images?imageId=${f.docId}&imageUrl=${f.imageUrl}&isFeatured=yes`}
                className="absolute inset-x-0 bottom-0 p-4 text-white z-10 text-center hover:underline"
              >
                <h1 className="text-xl font-bold mb-2">
                  {f.category.toUpperCase()}
                </h1>
                <h2 className="text-4xl font-bold mb-10">{f.title}</h2>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="absolute">
        <button
          onClick={handlePrev}
          className="absolute left-10 top-1/2 transform -translate-y-1/2 z-50 flex h-16 w-16 items-center justify-center text-white/50 font-bold"
        >
          <ArrowBackIosIcon fontSize="large" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 z-50 flex h-16 w-16 items-center justify-center text-white/50 font-bold"
        >
          <ArrowBackIosIcon fontSize="large" className="rotate-180" />
        </button>
      </div> */}
    </div>
  );
}

function PickView() {
  const [picks, setPicks] = useState<PickInfo[]>([]);
  useEffect(() => {
    const fetchPicks = async () => {
      // TODO: Replace mock data with actual data
      setPicks(mockPicks);
    };
    fetchPicks();
  }, []);

  return (
    <div className="flex flex-col w-full mt-10 md:mt-20">
      <div className="flex flex-col w-full px-4 md:px-20">
        <h2 className={`${bold_font.className} text-xl md:text-3xl`}>
          DECODED'S PICK
        </h2>
        <h3
          className={`${regular_font.className} mt-2 text-sm md:text-xl text-white/80`}
        >
          디코디드가 선택한 스타일을 확인하세요
        </h3>
      </div>
      {/* Main Pick View */}
      <div className="flex flex-col w-full mt-6 md:mt-10">
        {picks.map((pick, index) => {
          const isOdd = index % 2 !== 0;
          return (
            <div key={index}>
              {index === 2 && <SpotlightView />}
              <div className="flex flex-col lg:flex-row w-full mt-6 md:mt-10 justify-center px-4 md:px-20">
                <div
                  className={`flex flex-col md:flex-row w-full md:min-w-[1300px] ${
                    isOdd ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isOdd ? "md:ml-3 lg:ml-6" : "md:mr-3 lg:mr-6"
                    }`}
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={pick.imageUrl}
                        alt={pick.title}
                        fill
                        className="object-cover"
                      />
                      {pick.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.affilateUrl}
                          className="absolute bg-white/20 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-base"
                          style={{
                            top: `${item.pos.top}`,
                            left: `${item.pos.left}`,
                          }}
                        >
                          {String.fromCharCode(65 + itemIndex)}
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Description */}
                  <div
                    className={`w-full md:w-1/2 flex flex-col space-y-4 md:space-y-6 mt-4 md:mt-0`}
                  >
                    <div className="flex flex-col">
                      <div className="w-full md:w-1/2">
                        <h2
                          className={`${bold_font.className} text-xl md:text-2xl mb-2 md:mb-4`}
                        >
                          {pick.title}
                        </h2>
                        <p className="text-sm md:text-md text-white/80 mb-4 md:mb-6">
                          {pick.description}
                        </p>
                      </div>
                      <div className="flex items-center mb-4 md:mb-6">
                        <div className="flex items-center w-[24px] h-[24px] md:w-[30px] md:h-[30px] relative">
                          <Image
                            src={pick.imageUrl}
                            alt={pick.title}
                            fill={true}
                            style={{ objectFit: "cover" }}
                            className="rounded-full mr-2 md:mr-3"
                          />
                        </div>
                        <span
                          className={`${regular_font.className} ml-2 md:ml-4 text-sm md:text-base`}
                        >
                          {pick.artist}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between">
                      {pick.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={`w-[48%] md:w-[48%] mb-4 md:mb-6 ${
                            itemIndex === 0 ? "mt-0" : "md:mt-20"
                          }`}
                        >
                          <Link
                            href={item.affilateUrl}
                            className="block relative aspect-square mb-2 w-full aspect-[3/4] bg-white"
                          >
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill={true}
                              style={{ objectFit: "cover" }}
                            />
                          </Link>
                          <p className="text-xs md:text-sm text-white/80 hover:underline">
                            {item.brand.name.replace("_", " ").toUpperCase()}
                          </p>
                          <h3
                            className={`${bold_font.className} text-sm md:text-lg`}
                          >
                            {item.name}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpotlightView() {
  const [spotlight, setSpotlight] = useState<SpotlightInfo | null>(null);

  useEffect(() => {
    const fetchSpotlight = async () => {
      setSpotlight(mockSpotlight);
    };
    fetchSpotlight();
  }, []);

  if (!spotlight) return null;

  return (
    <div className="flex flex-col w-full mt-20 bg-[#171717] p-20">
      <h2 className={`flex ${bold_font.className} mb-2 text-xl md:text-4xl`}>
        ARTIST SPOTLIGHT
      </h2>
      <h3
        className={`flex ${regular_font.className} text-md md:text-xl text-white/80 mb-10`}
      >
        아티스트의 다양한 스타일을 확인해보세요
      </h3>

      <div className="flex flex-col md:flex-row gap-6">
        <Link
          href={`/images?imageId=${
            spotlight.images[0].id
          }&imageUrl=${encodeURIComponent(spotlight.images[0].imageUrl)}`}
          className="w-full md:w-1/2 md:h-1/2"
        >
          <Image
            src={spotlight.images[0].imageUrl}
            alt={spotlight.title}
            width={800}
            height={800}
            className="object-cover w-full h-full"
          />
        </Link>
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className={`${bold_font.className} text-2xl md:text-3xl mb-4`}>
              {spotlight.title}
            </h2>
            <p className="text-white/80 mb-6">{spotlight.description}</p>
            <div className="flex items-center mb-6">
              <Image
                src={spotlight.profileImgUrl}
                alt={spotlight.artist}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <span className={`${regular_font.className}`}>
                {spotlight.artist}
              </span>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <Link
              href={`/search?keyword=${spotlight.artist}`}
              className={`${bold_font.className} text-right mt-4 text-white/80 hover:text-white mb-4`}
            >
              VIEW MORE +
            </Link>
            <div className="flex gap-4 w-full">
              {spotlight.images.slice(1, 3).map((image, index) => (
                <Link
                  key={index}
                  href={`/images?imageId=${
                    image.id
                  }&imageUrl=${encodeURIComponent(image.imageUrl)}`}
                  className="w-1/2 aspect-[3/4]"
                >
                  <Image
                    src={image.imageUrl}
                    alt={`${spotlight.title} ${index + 2}`}
                    width={300}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverView() {
  const [discover, setDiscover] = useState<DiscoverInfo[] | null>(null);
  const [sectionState, setSectionState] = useState<{
    sections: string[];
    currentSection: string;
  } | null>(null);
  const [items, setItems] = useState<Record<
    string,
    {
      name: string;
      imageUrl: string;
      brand: string;
    }[]
  > | null>(null);
  useEffect(() => {
    const fetchDiscover = async () => {
      setDiscover(mockDiscover);
      setSectionState({
        sections: mockDiscover.map((section) => section.section),
        currentSection: mockDiscover[0].section,
      });
      mockDiscover.forEach((section) => {
        setItems((prev) => {
          return {
            ...prev,
            [section.section]: section.items,
          };
        });
      });
    };
    fetchDiscover();
  }, []);

  return (
    <div className="flex flex-col w-full mt-10 md:mt-20 bg-[#F2F2F2] p-4 md:p-20">
      <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center">
        <div className="flex flex-col w-full mb-4 md:mb-0">
          <h2
            className={`flex ${bold_font.className} mb-2 text-xl md:text-2xl text-black`}
          >
            DISCOVER ITEMS
          </h2>
          <h3
            className={`flex ${regular_font.className} text-sm md:text-xl text-black/80`}
          >
            카테고리에 따른 다양한 아이템을 확인해보세요
          </h3>
        </div>
        <div className="flex flex-wrap md:flex-nowrap md:w-[20vw]">
          {sectionState &&
            sectionState.sections.map((section, index) => (
              <div
                key={index}
                className={`flex flex-col mr-4 md:mr-0 md:w-full mb-2 md:mb-0`}
              >
                <p
                  className={`${
                    bold_font.className
                  } text-sm md:text-lg text-black cursor-pointer ${
                    sectionState.currentSection === section
                      ? "text-black"
                      : "text-black/50"
                  }`}
                  onClick={() =>
                    setSectionState({
                      ...sectionState,
                      currentSection: section,
                    })
                  }
                >
                  {section.toUpperCase()}
                </p>
              </div>
            ))}
        </div>
      </div>
      {sectionState && items && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10">
          {items[sectionState.currentSection].map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex w-full">
                <div className="relative w-full pb-[100%]">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full mt-2 md:mt-4">
                <h2
                  className={`${bold_font.className} text-sm md:text-lg text-black`}
                >
                  {item.brand.toUpperCase()}
                </h2>
                <h3
                  className={`${bold_font.className} text-xs md:text-lg text-black/50`}
                >
                  {item.name.toUpperCase()}
                </h3>
              </div>
              <div className="flex cursor-pointer mt-2 md:mt-4 items-center">
                <p
                  className={`${bold_font.className} text-xs md:text-md text-black/50`}
                >
                  관련 스타일
                </p>
                <ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6 text-black/50" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrendingNowView() {
  const [trendingNow, setTrendingNow] = useState<TrendingNowInfo[] | null>(
    null
  );
  useEffect(() => {
    const fetchTrendingNow = async () => {
      setTrendingNow(mockTrendingNow);
    };
    fetchTrendingNow();
  }, []);

  return (
    <div className="flex flex-col w-full mt-10 md:mt-20 p-4 md:p-20">
      <h2 className={`flex ${bold_font.className} mb-2 text-lg md:text-2xl`}>
        TRENDING NOW
      </h2>
      <h3
        className={`flex ${regular_font.className} text-sm md:text-xl text-white/80`}
      >
        인기있는 키워드를 확인해보세요
      </h3>
      <div className="flex flex-wrap w-full md:w-[60vw] mt-6 md:mt-10">
        {trendingNow?.map((tag, index) => (
          <Link
            href={`/search?keyword=${tag.name}`}
            key={index}
            className={`flex w-fit p-2 md:p-4 bg-transparent rounded-full border border-white/20 hover:bg-white/20 mt-2 md:mt-4 mr-2 md:mr-4`}
          >
            {/* <Image
              src={tag.imageUrl}
              alt={tag.name}
              width={20}
              height={20}
              className="rounded-full border border-white/20"
            /> */}
            <h3 className={`${bold_font.className} text-sm md:text-lg`}>
              {tag.name.toUpperCase()}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PinView({ images }: { images: MainImage[] | null }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const getCols = () => {
    if (isMobile) return 2;
    if (isTablet) return 4;
    return 6;
  };

  return (
    <div className="flex flex-col w-full mt-20">
      <h2
        className={`flex ${bold_font.className} mb-10 justify-center text-xl md:text-4xl`}
      >
        스타일 둘러보기
      </h2>
      <ImageList
        variant="masonry"
        cols={getCols()}
        gap={20}
        className="p-2 mt-10"
      >
        <div>
          {images?.map((image, index) => (
            <ImageListItem key={index}>
              <Pin image={image} />
            </ImageListItem>
          ))}
        </div>
      </ImageList>
    </div>
  );
}

function NewsSection() {
  const [latestArticles, setLatestArticles] = useState<ArticleInfo[]>([]);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      const docs = await FirebaseHelper.docs("articles");
      const articleInfoList: ArticleInfo[] = [];
      docs.forEach((doc) => {
        const newsData = doc.data() as ArticleInfo;
        if (newsData.src) {
          articleInfoList.push(newsData);
        }
      });
      console.log("Fetched articles data:", articleInfoList);
      const sortedArticles = articleInfoList.sort(
        (a, b) =>
          new Date(b.createdAt ?? "").getTime() -
          new Date(a.createdAt ?? "").getTime()
      );

      setLatestArticles(sortedArticles.slice(0, 4));
    };

    fetchLatestArticles();
  }, [setLatestArticles]);

  const [expandedArticleIndex, setExpandedArticleIndex] = useState<
    number | null
  >(null);

  const handleReadMoreClick = (index: number) => {
    setExpandedArticleIndex(index === expandedArticleIndex ? null : index);
  };

  return (
    <div className="flex flex-col w-full border-b border-black">
      <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {latestArticles.map((article, index) => (
          <div key={index} className="flex flex-col p-4 border border-black">
            <Link
              href={article.src as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={article.imageUrl ?? ""}
                alt={article.title}
                width={375}
                height={250}
                className="border border-black"
              />
            </Link>
            <div className="flex flex-col h-full justify-between">
              <div className="flex flex-col py-2">
                <p className="text-[8px] text-white bg-black rounded-md w-fit p-1">
                  HYPEBEAST
                </p>
                <a
                  href={article.src as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold py-3"
                >
                  {article.title}
                </a>
              </div>
              {expandedArticleIndex === index && (
                <p className="mt-2 text-gray-700">{article.summary}</p>
              )}
              <button
                onClick={() => handleReadMoreClick(index)}
                className="mt-4 text-blue-500 hover:underline"
              >
                {expandedArticleIndex === index
                  ? "Hide Summary"
                  : "Open Summary"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-10">
        <Link
          href="/news"
          className="text-black border border-black w-full rounded-lg text-center p-2"
        >
          More NEWS
        </Link>
      </div>
    </div>
  );
}

function RequestSection() {
  const handleRequest = () => {
    const userDocId = window.sessionStorage.getItem("USER_DOC_ID");
    if (!userDocId) {
      alert("해당기능은 준비중입니다.");
      return;
    }
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();
  };

  return (
    <div
      className={`flex flex-col w-full text-xl md:text-2xl justify-center ${regular_font.className} my-20`}
    >
      <div
        className={`flex flex-col p-20 items-center justify-center bg-[#212124] opacity-80`}
      >
        좋아하는 셀럽의 아이템이 궁금하다면?
        <Button
          style={{
            color: "white",
            border: "1px solid white",
            width: "200px",
            height: "40px",
            marginTop: "40px",
          }}
          onClick={() => handleRequest()}
        >
          요청하기
        </Button>
      </div>
      <RequestModal />
    </div>
  );
}

function RequestModal() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  return (
    <dialog
      id="my_modal_1"
      className="modal flex flex-col w-[50vw] h-[90vh] p-4 rounded-xl left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll bg-[#101011]"
      onClose={() => setSelectedImage(null)}
    >
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col text-center mb-5">
          <h2 className={`${bold_font.className} text-lg`}>
            아이템 정보 요청하기
          </h2>
        </div>
        <div className="flex flex-col items-center">
          {selectedImage && (
            <div className="mb-4">
              <label htmlFor="imageUpload" className="btn cursor-pointer">
                이미지 선택
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
          <div className="relative w-[500px] h-[500px] flex items-center justify-center mb-4">
            {selectedImage ? (
              <Image
                src={URL.createObjectURL(selectedImage)}
                fill={true}
                style={{ objectFit: "contain" }}
                alt="업로드된 이미지"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div>
                <label htmlFor="imageUpload" className="btn cursor-pointer">
                  이미지 선택
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
          <div className="flex flex-1 mt-4 justify-center items-center">
            {selectedImage && (
              <button className="btn w-full ml-4">업로드</button>
            )}
            <button
              className="btn w-full ml-4"
              onClick={() =>
                (
                  document.getElementById("my_modal_1") as HTMLDialogElement
                )?.close()
              }
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default Home;
