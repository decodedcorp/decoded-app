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
} from "@/types/model";
import Carousel from "@/components/ui/carousel";
import ProgressBar from "@/components/ui/progress-bar";
import { Button, ImageList, ImageListItem } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useTheme, useMediaQuery } from "@mui/material";
import { MockCelebrities } from "@/components/helpers/mock";
import { LoadingView } from "@/components/ui/loading";
import Pin from "@/components/ui/pin";

function Home() {
  const [mainImages, setMainImages] = useState<MainImage[] | null>(null);

  useEffect(() => {
    const fetchAllImages = async () => {
      const storageItems = await FirebaseHelper.listAllStorageItems("images");
      const imageStorage = storageItems.items;
      const images = await Promise.all(
        imageStorage.map(async (image) => {
          try {
            const [metadata, url] = await Promise.all([
              FirebaseHelper.metadata(image),
              FirebaseHelper.downloadUrl(image),
            ]);
            const imageDocId = metadata.customMetadata?.id;
            if (!imageDocId) {
              return;
            }
            const imageDoc = await FirebaseHelper.doc("images", imageDocId);
            if (imageDoc.exists()) {
              const imageInfo = imageDoc.data() as ImageInfo;
              var artistInfoList: ArtistInfo[] | undefined;
              var artistsTags = imageInfo.tags?.["artists"];
              if (artistsTags) {
                const artistPromises = artistsTags.map(async (artist) => {
                  const artistDoc = await FirebaseHelper.doc("artists", artist);
                  if (artistDoc.exists()) {
                    return artistDoc.data() as ArtistInfo;
                  }
                });
                const res = await Promise.all(artistPromises);
                artistInfoList = res.filter(
                  (artist): artist is ArtistInfo => artist !== undefined
                );
              }
              var itemInfoList = new Map<ItemInfo, [Position, BrandInfo[]]>();
              if (imageInfo.taggedItem) {
                const itemPromises = imageInfo.taggedItem.map(async (item) => {
                  const taggedItem = item as TaggedItem;
                  const itemDoc = await FirebaseHelper.doc(
                    "items",
                    taggedItem.id
                  );
                  if (itemDoc.exists()) {
                    const itemInfo = itemDoc.data() as ItemInfo;
                    let brandInfo: BrandInfo[] = [];
                    const brandTags = itemInfo.tags?.["brands"];
                    if (brandTags) {
                      const brandPromises = brandTags.map(async (b) => {
                        const doc = await FirebaseHelper.doc("brands", b);
                        if (doc.exists()) {
                          return doc.data() as BrandInfo;
                        }
                        return undefined;
                      });
                      const res = await Promise.all(brandPromises);
                      brandInfo = res.filter(
                        (brand): brand is BrandInfo => brand !== undefined
                      );
                    }
                    itemInfoList.set(itemInfo, [taggedItem.pos, brandInfo]);
                  }
                });

                await Promise.all(itemPromises);
              }
              let mainImage: MainImage = {
                imageUrl: url,
                docId: imageDocId,
                title: imageInfo.title,
                itemInfoList,
                artistInfoList,
                description: imageInfo.description,
              };
              return mainImage;
            }
          } catch (error) {
            console.error("Error processing item:", error);
            return;
          }
        })
      );
      let filtered = images.filter(
        (image): image is MainImage => image !== undefined
      );
      setMainImages(filtered);
    };
    fetchAllImages();
  }, []);

  return (
    <div className="flex flex-col min-h-[100vh]">
      {mainImages ? (
        <>
          <FeaturedView />
          {/* <PinView images={mainImages} /> */}
          {/* <RequestSection /> */}
        </>
      ) : (
        <LoadingView />
      )}
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
            className={`flex flex-col md:flex-row items-center p-2 md:p-10 ${
              index === currentIndex ? "opacity-100" : "opacity-20"
            }`}
          >
            <div className="relative w-[80vw]">
              <div className="aspect-w-16 aspect-h-9">
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

function ImageSelectView({ images }: { images: MainImage[] | null }) {
  const [currentCelebrity, setCurrentCelebrity] = useState("");
  const celebrities = useMemo(() => MockCelebrities, []);

  useEffect(() => {
    const changeCelebrity = () => {
      const randomIndex = Math.floor(Math.random() * celebrities.length);
      setCurrentCelebrity(celebrities[randomIndex]);
    };

    changeCelebrity();
    const intervalId = setInterval(changeCelebrity, 2000);

    return () => clearInterval(intervalId);
  }, [celebrities]);

  return (
    <div className="flex flex-col md:p-20 w-full mt-20">
      <h2
        className={`flex ${bold_font.className} mb-10 justify-center text-xl md:text-4xl`}
      >
        아이템 둘러보기
      </h2>
      <div className="mt-10">
        <Carousel images={images} />
      </div>
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
