"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  bold_font,
  regular_font,
  semi_bold_font,
} from "@/components/helpers/util";
import { LoadingView } from "@/components/ui/loading";
import { FirebaseHelper } from "@/common/firebase";
import { useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ImageInfo,
  FeaturedInfo,
  ArtistInfo,
  BrandInfo,
  HoverItem,
  ArticleInfo,
  DetailPageState,
} from "@/types/model";
import AddIcon from "@mui/icons-material/Add";

function DetailPage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId");
  const imageUrl = searchParams.get("imageUrl");
  const isFeatured = searchParams.get("isFeatured");

  if (!imageId || !imageUrl) {
    notFound();
  }
  const isFeaturedBool = isFeatured ? true : false;

  return isFeaturedBool ? (
    <MultiImageView imageId={imageId} />
  ) : (
    <SingleImageView
      imageId={imageId}
      imageUrl={imageUrl}
      isFeatured={isFeaturedBool}
    />
  );
}

function MultiImageView({ imageId }: { imageId: string }) {
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [featuredImgs, setFeaturedImgs] = useState<
    { imageUrl: string; imgInfo: ImageInfo; imageDocId: string }[] | null
  >(null);
  const [artistArticleList, setArtistArticleList] = useState<
    ArticleInfo[] | undefined
  >(undefined);
  const [artistImgList, setArtistImgList] = useState<[string, string][]>([]);

  useEffect(() => {
    const fetchFeaturedImage = async () => {
      var artistArticleList: ArticleInfo[] | undefined = undefined;
      var artistImgList: [string, string][] = [];
      var filter: string[] = [];
      const imgDocId = decodeURIComponent(imageId);
      if (!(await FirebaseHelper.docExists("featured", imgDocId))) {
        return;
      }
      const img = (
        await FirebaseHelper.doc("featured", imgDocId)
      ).data() as FeaturedInfo;
      let featuredImgs = await Promise.all(
        img.images.map(async (imageDocId) => {
          filter.push(imageDocId);
          const imgRef = await FirebaseHelper.doc("images", imageDocId);
          const imgInfo = imgRef.data() as ImageInfo;
          const ref = FirebaseHelper.storageRef(`images/${imageDocId}`);
          const url = await FirebaseHelper.downloadUrl(ref);
          const artistTags = imgInfo.tags?.artists;
          // TODO: Make it simple
          if (artistTags) {
            const artistInfoList = await Promise.all(
              artistTags.map(async (artistDocId) => {
                return (
                  await FirebaseHelper.doc("artists", artistDocId)
                ).data() as ArtistInfo;
              })
            );
            await Promise.all(
              artistInfoList.map(async (a) => {
                const artistArticleDocIdList = a.tags?.articles;
                const artistImgDocIdList = a.tags?.images;

                if (artistArticleDocIdList) {
                  const articles = await Promise.all(
                    artistArticleDocIdList.map(async (articleDocId) => {
                      return (
                        await FirebaseHelper.doc("articles", articleDocId)
                      ).data() as ArticleInfo;
                    })
                  );
                  artistArticleList = articles;
                }
                if (artistImgDocIdList) {
                  const images = await FirebaseHelper.listAllStorageItems(
                    "images"
                  );
                  // Since item_doc_id is stored as custom metadata, logic is a bit complicated.
                  // After changing item_doc_id as file name, it would be simpler
                  await Promise.all(
                    images.items.map(async (image) => {
                      const metadata = await FirebaseHelper.metadata(image);
                      const docId = metadata?.customMetadata?.id;
                      if (docId && artistImgDocIdList.includes(docId)) {
                        // Skip if it's the same image
                        if (docId === imgDocId) {
                          return;
                        }
                        const imageUrl = await FirebaseHelper.downloadUrl(
                          image
                        );
                        if (!artistImgList.some(([id, _]) => id === docId)) {
                          artistImgList.push([docId, imageUrl]);
                        }
                      }
                    })
                  );
                }
              })
            );
          }
          return {
            imageUrl: url,
            imageDocId: imageDocId,
            imgInfo: imgInfo,
            artistArticleList: artistArticleList,
            artistImgList: artistImgList,
          };
        })
      );
      setTitle(img.title);
      setDescription(img.description);
      setArtistArticleList(artistArticleList);
      setArtistImgList(artistImgList.filter(([id, _]) => !filter.includes(id)));
      setFeaturedImgs(featuredImgs);
    };
    fetchFeaturedImage();
  }, [imageId]);
  return featuredImgs ? (
    <div className="flex flex-col justify-center items-center my-32 p-2 w-full">
      <div className="flex flex-col items-center p-10">
        <h1
          className={`${bold_font.className} text-3xl md:text-5xl font-bold text-white mb-5`}
        >
          {title}
        </h1>
        <h2
          className={`${regular_font.className} text-md md:text-lg text-white px-5`}
        >
          {description}
        </h2>
      </div>
      {featuredImgs.map((image, index) => (
        <div key={index} className="flex flex-col w-full mt-10 p-5 text-center">
          <p
            className={`${regular_font.className} text-lg md:text-4xl text-white mb-5 font-bold`}
          >
            {index + 1}
          </p>
          <SingleImageView
            imageId={image.imageDocId}
            imageUrl={image.imageUrl}
            isFeatured={true}
          />
        </div>
      ))}
      <MoreToExploreView imgList={artistImgList} />
      <ArtistArticleView articleList={artistArticleList} />
    </div>
  ) : (
    <LoadingView />
  );
}

function SingleImageView({
  imageId,
  imageUrl,
  isFeatured,
}: {
  imageId: string;
  imageUrl: string;
  isFeatured: boolean;
}) {
  let [detailPageState, setDetailPageState] = useState<DetailPageState | null>(
    null
  );
  useEffect(() => {
    const fetch = async () => {
      const imgDocId = decodeURIComponent(imageId);
      if (!(await FirebaseHelper.docExists("images", imgDocId))) {
        return;
      }
      const img = (
        await FirebaseHelper.doc("images", imgDocId)
      ).data() as ImageInfo;
      var itemList: HoverItem[] = await FirebaseHelper.getHoverItems(imgDocId);
      itemList = itemList.sort((a, b) => {
        const topA = parseInt(a.pos.top || "0%");
        const topB = parseInt(b.pos.top || "0%");
        if (topA !== topB) {
          return topA - topB;
        }
        const leftA = parseInt(a.pos.left || "0%");
        const leftB = parseInt(b.pos.left || "0%");
        return leftA - leftB;
      });
      var brandList: string[] = [];
      var brandUrlList: Map<string, string> = new Map();
      const brandLogo: Map<string, string> = new Map();
      var artistList: string[] = [];
      var artistArticleList: ArticleInfo[] | undefined = undefined;
      var artistImgList: [string, string][] = [];
      const colorInfo = img.colorInfo;

      // Image artist tags
      const imgArtistTags = img.tags?.artists;
      const brandTags = img.tags?.brands;

      brandList = Array.from(
        new Set(
          itemList
            .map((item) =>
              (item.info.brands || []).map((brand) =>
                brand.toLowerCase().replace(/\s/g, "_")
              )
            )
            .flat()
        )
      );

      if (brandTags) {
        const brandInfoList = await Promise.all(
          brandTags.map(async (brandDocId) => {
            return (
              await FirebaseHelper.doc("brands", brandDocId)
            ).data() as BrandInfo;
          })
        );
        brandInfoList.map((brand) => {
          brandLogo.set(brand.name, brand.logoImageUrl ?? "");
          // key is brand name in lowercase with spaces replaced with underscores
          brandUrlList.set(
            brand.name.toLowerCase().replace(/\s/g, "_"),
            brand.sns?.["instagram"] ?? brand.websiteUrl ?? ""
          );
        });
      }
      // Update image related artist stuff if any
      if (imgArtistTags && !isFeatured) {
        const artistInfoList = await Promise.all(
          imgArtistTags.map(async (artistDocId) => {
            return (
              await FirebaseHelper.doc("artists", artistDocId)
            ).data() as ArtistInfo;
          })
        );
        await Promise.all(
          artistInfoList.map(async (a) => {
            // Update artist name list
            artistList.push(a.name);

            const artistArticleDocIdList = a.tags?.articles;
            const artistImgDocIdList = a.tags?.images;

            if (artistArticleDocIdList) {
              const articles = await Promise.all(
                artistArticleDocIdList.map(async (articleDocId) => {
                  return (
                    await FirebaseHelper.doc("articles", articleDocId)
                  ).data() as ArticleInfo;
                })
              );
              artistArticleList = articles;
            }
            if (artistImgDocIdList) {
              const images = await FirebaseHelper.listAllStorageItems("images");
              // Since item_doc_id is stored as custom metadata, logic is a bit complicated.
              // After changing item_doc_id as file name, it would be simpler
              await Promise.all(
                images.items.map(async (image) => {
                  const metadata = await FirebaseHelper.metadata(image);
                  const docId = metadata?.customMetadata?.id;
                  if (docId && artistImgDocIdList.includes(docId)) {
                    // Skip if it's the same image
                    if (docId === imgDocId) {
                      return;
                    }
                    const imageUrl = await FirebaseHelper.downloadUrl(image);
                    artistImgList.push([docId, imageUrl]);
                  }
                })
              );
            }
          })
        );
      }
      setDetailPageState({
        img: img,
        itemList: itemList,
        brandUrlList: brandUrlList,
        brandImgList: brandLogo,
        artistImgList: artistImgList,
        artistList: artistList,
        artistArticleList: artistArticleList,
        colorInfo: colorInfo,
      });
    };
    fetch();
  }, [imageId, isFeatured]);

  return detailPageState ? (
    <div className="flex-col justify-center text-center items-center">
      <div
        className={`flex flex-col p-4 md:p-0 ${isFeatured ? "mt-0" : "mt-40"}`}
      >
        <DetailView
          detailPageState={detailPageState}
          imageUrl={imageUrl}
          isFeatured={isFeatured}
        />
      </div>
      <MoreToExploreView imgList={detailPageState.artistImgList} />
      <ArtistArticleView articleList={detailPageState.artistArticleList} />
    </div>
  ) : (
    <LoadingView />
  );
}

function DetailView({
  detailPageState,
  imageUrl,
  isFeatured,
}: {
  detailPageState: DetailPageState;
  imageUrl: string;
  isFeatured: boolean;
}) {
  return (
    <div className={"flex flex-col w-full"}>
      <DescriptionView
        detailPageState={detailPageState}
        isFeatured={isFeatured}
      />
      <ImageView detailPageState={detailPageState} imageUrl={imageUrl} />
    </div>
  );
}

function DescriptionView({
  detailPageState,
  isFeatured,
}: {
  detailPageState: DetailPageState;
  isFeatured: boolean;
}) {
  return (
    <div className={"flex flex-col"}>
      <h2
        className={`${bold_font.className} text-4xl font-bold mb-4 ${
          isFeatured ? "hidden" : "block"
        }`}
      >
        {detailPageState.img?.title}
      </h2>
      <p
        className={`${regular_font.className} text-lg md:text-md px-2 md:px-32 mt-2`}
      >
        {detailPageState.img?.description}
      </p>
      <div
        className={`flex flex-col items-center mt-10 ${
          isFeatured ? "hidden" : "block"
        }`}
      >
        <p className={`${semi_bold_font.className} text-lg md:text-2xl`}>
          ARTIST:
        </p>
        {detailPageState.artistList?.map((name, index) => (
          <Link
            key={index}
            href={`/artists?name=${encodeURIComponent(name)}`}
            className={`${semi_bold_font.className} text-xl font-bold mx-2`}
          >
            <p className="underline">{name.toUpperCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ImageView({
  detailPageState,
  imageUrl,
}: {
  detailPageState: DetailPageState;
  imageUrl: string;
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <div className="flex flex-col w-full md:flex-row justify-center px-2 md:px-20 mt-10">
      <div className="w-full">
        <div className="relative w-full aspect-w-3 aspect-h-4">
          <Image
            src={imageUrl}
            alt="Featured fashion"
            fill={true}
            style={{ objectFit: "cover" }}
          />
          <div className="w-full">
            {detailPageState.img &&
              detailPageState.itemList?.map((item, index) => (
                <a
                  key={item.info.name}
                  href={item.info?.affiliateUrl ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "absolute",
                    top: item.pos.top,
                    left: item.pos.left,
                    cursor: "pointer",
                  }}
                  className="point"
                >
                  <div
                    className="bg-red-500 w-5 h-5 flex justify-center items-center"
                    onMouseOver={() => setCurrentIndex(index)}
                  >
                    <AddIcon style={{ width: "15px", height: "15px" }} />
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full justify-between mt-10">
        <div className="flex w-full justify-center">
          {detailPageState.itemList?.map((item, index) => (
            <div
              key={index}
              className={`justify-center w-full ${
                currentIndex === index ? "block" : "hidden"
              }`}
            >
              <div className="flex items-center justify-center">
                <Image
                  src={
                    detailPageState.brandImgList?.get(
                      item.info.brands?.[0] ?? ""
                    ) ?? ""
                  }
                  alt={item.info.brands?.[0] ?? ""}
                  width={25}
                  height={25}
                  className="rounded-full"
                />
                <a
                  className={`${regular_font.className} text-xl ml-2 hover:underline hover:cursor-pointer`}
                  href={
                    detailPageState.brandUrlList?.get(
                      item.info.brands?.[0] ?? ""
                    ) ?? ""
                  }
                >
                  {item.info.brands?.[0].replace(/_/g, " ").toUpperCase()}
                </a>
              </div>
              <div className="flex justify-center items-center mt-2 md:mt-20">
                <div className="relative group w-[100vw] md:w-[400px] h-[100vh] md:h-[600px]">
                  <Link
                    href={item.info.affiliateUrl ?? ""}
                    className="block w-full h-full"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={item.info.imageUrl ?? ""}
                        alt={item.info.name}
                        fill={true}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="flex flex-col absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
                        <p
                          className={`${regular_font.className} text-sm md:text-md p-2 text-white text-center`}
                        >
                          {item.info.name}
                        </p>
                        <p
                          className={`${regular_font.className} text-sm md:text-md p-2 text-white text-center`}
                        >
                          {item.info.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoreToExploreView({
  imgList,
}: {
  imgList: [string, string][] | undefined;
}) {
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null
  );
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize(); // 초기 설정
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const totalPages = Math.ceil((imgList?.length || 0) / itemsPerPage);
  const currentItems = imgList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full text-center mt-20">
      {imgList && imgList.length > 0 && (
        <div className="items-center justify-center mt-10">
          <h2 className={`${regular_font.className} text-xl`}>
            More to explore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-stretch place-items-stretch my-10 px-10">
            {currentItems?.map((image, index) => (
              <Link
                key={index}
                href={`?imageId=${image[0]}&imageUrl=${encodeURIComponent(
                  image[1]
                )}`}
                prefetch={false}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full h-[300px] md:h-[600px] aspect-w-3 aspect-h-4"
                onMouseOver={() => setHoveredImageIndex(index)}
                onMouseOut={() => setHoveredImageIndex(null)}
              >
                <Image
                  src={image[1]}
                  alt="Artist Image"
                  fill={true}
                  style={{ objectFit: "cover" }}
                  className="more-tagged rounded-md"
                  loading="lazy"
                />
                {hoveredImageIndex === index && (
                  <div className="flex flex-col absolute inset-0 bg-black bg-opacity-50 items-center justify-center transition-opacity duration-300 ease-in-out">
                    <p
                      className={`${regular_font.className} px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors text-sm`}
                    >
                      아이템 둘러보기
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                    }}
                    className={`text-md md:text-lg px-3 py-1 rounded ${
                      currentPage === page ? "text-white" : "text-gray-500"
                    }`}
                  >
                    •
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ArtistArticleView({
  articleList,
}: {
  articleList: ArticleInfo[] | undefined;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize(); // 초기 설정
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const totalPages = Math.ceil((articleList?.length || 0) / itemsPerPage);
  const currentItems = articleList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    articleList && (
      <div className="flex flex-col mt-10 justify-center w-full">
        <h2 className={`${regular_font.className} text-xl text-center`}>
          Related Articles
        </h2>
        <div className="grid grid-cols-1 items-center justify-center p-10 gap-4">
          {currentItems?.map((article, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full"
            >
              <Link
                key={index}
                href={(article.src as string) ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col w-full h-[90vh] justify-center items-center"
              >
                <Image
                  src={article.imageUrl ?? ""}
                  alt={article.title ?? ""}
                  fill={true}
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                  loading="lazy"
                />
              </Link>
              <p
                className={`${semi_bold_font.className} text-2xl text-white hover:underline cursor-pointer mt-10 `}
              >
                {article.title}
              </p>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                }}
                className={`text-md md:text-lg px-3 py-1 rounded ${
                  currentPage === page ? "text-white" : "text-gray-500"
                }`}
              >
                •
              </button>
            ))}
          </div>
        )}
      </div>
    )
  );
}

export default DetailPage;
