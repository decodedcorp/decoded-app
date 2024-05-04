import Image from "next/image";
import Link from "next/link";
import { FirebaseHelper } from "../../common/firebase";
import { listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { main_font } from "@/components/helpers/util";
import { Article } from "@/types/model";
import { getDocs, collection, Timestamp } from "firebase/firestore";

const fetchAllImages = async (point: string) => {
  try {
    const storage_ref = FirebaseHelper.storageRef(point);
    const res = await listAll(storage_ref);
    const urlAndHash = await Promise.all(
      res.items.map(async (itemRef) => {
        const [metadata, url] = await Promise.all([
          getMetadata(itemRef),
          getDownloadURL(itemRef),
        ]);
        if (metadata.md5Hash) {
          console.log(metadata.md5Hash);
          return { url, hash: metadata.md5Hash };
        }
        return null;
      })
    );
    return urlAndHash.filter(
      (item): item is { url: string; hash: string } => item !== null
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return [];
  }
};

const fetchAllArticles = async (): Promise<Article[]> => {
  let newsList: Article[] = [];
  const db = FirebaseHelper.db();
  const querySnapshot = await getDocs(collection(db, "article"));
  const current_timestamp = Timestamp.fromDate(new Date());
  querySnapshot.forEach((doc) => {
    const article = doc.data() as Article;
    // if (article.time !== undefined) {
    //   const dateOnly = article.time.split("T")[0];
    //   console.log("Article Date", dateOnly);
    // }
    // console.log("current_timestamp", current_timestamp.toString());
    newsList.push(article);
  });
  return newsList;
};

async function Home() {
  return (
    <div>
      <NewTaggedSection />
      <ArticleSection />
      {/* <SpotlightSection /> */}
      {/* <MostHypeSection /> */}
    </div>
  );
}

async function NewTaggedSection() {
  return (
    <div className="h-full rounded-md border-l-2 border-r-2 border-b-2 border-black p-3">
      <div className="flex justify-start items-stretch h-full">
        <div className="flex flex-col w-full h-full">
          <h1 className={`${main_font.className} text-2xl font-bold`}>
            Today's Pick
          </h1>
          <h2 className="text-lg font-bold">Description </h2>
        </div>
        <ImageCarousel />
      </div>
    </div>
  );
}

async function ImageCarousel() {
  const urlsAndHashes = await fetchAllImages("images");
  return (
    <div className="w-60 carousel rounded-box mx-5" style={{ width: "70vw" }}>
      {urlsAndHashes.map(({ url, hash }) => (
        <div
          key={hash}
          className="carousel-item w-full relative aspect-w-5 aspect-h-6"
        >
          <Link
            href={`images/${hash}?imageUrl=${encodeURIComponent(url)}`}
            prefetch={false}
          >
            <Image
              alt="LOADING"
              className="w-full h-auto rounded-lg"
              layout="fill"
              src={url}
              quality={80}
              objectFit="cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,..."
              sizes="100vw"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

async function ArticleSection() {
  const articles = await fetchAllArticles();
  return (
    <div className="rounded-md border-l-2 border-r-2 border-black p-3">
      <h1 className={`${main_font.className} text-2xl font-bold mb-4`}>
        LATEST NEWS
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <div key={index} className="news-item">
            {article.src && (
              <a href={article.url}>
                {" "}
                {/* 링크 추가 */}
                <img
                  src={article.src.split(" ")[0]} // 공백을 기준으로 문자열을 분리하고 첫 번째 요소를 사용
                  alt={article.title}
                  className="w-full h-auto"
                />
              </a>
            )}
            <div className="text-sm bg-black text-white p-2">
              {article.title}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full text-align-center mt-4 py-2 px-6 bg-[#FF204E] text-white rounded">
        See More
      </button>
    </div>
  );
}

async function SpotlightSection() {
  return (
    <div className="rounded-md border-2 border-black p-3 bg-black">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">SPOTLIGHT</h1>
        <h2 className="text-2xl font-bold">JENNIE 24SS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-3">
          <img
            src="path/to/jennie-main.jpg"
            alt="Jennie Main"
            className="w-full"
          />
        </div>
        <div className="col-span-1">
          <img src="path/to/product.jpg" alt="Product" className="w-full" />
          <p className="text-center mt-2">
            Baby Fox Patch Cardigan
            <br />
            $415
          </p>
        </div>
        <div className="col-span-1">
          <img src="path/to/jennie-1.jpg" alt="Jennie 1" className="w-full" />
        </div>
        <div className="col-span-1">
          <img src="path/to/jennie-2.jpg" alt="Jennie 2" className="w-full" />
        </div>
        <div className="col-span-1">
          <img src="path/to/jennie-3.jpg" alt="Jennie 3" className="w-full" />
        </div>
      </div>
    </div>
  );
}

async function MostHypeSection() {
  return (
    <div className="rounded-md border-l-2 border-r-2 border-black p-3">
      <h1 className={`${main_font.className} text-2xl font-bold mb-4`}>
        MOST HYPE
      </h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="news-item">
          <img
            src="path/to/image1.jpg"
            alt="News Image 1"
            className="w-full h-auto"
          />
          <div className="text-sm bg-black text-white p-2">
            HYPEBEAST 디스인증페배이 '로텐덤' 브랜드를 출시했다
          </div>
        </div>
        <div className="news-item">
          <img
            src="path/to/image2.jpg"
            alt="News Image 2"
            className="w-full h-auto"
          />
          <div className="text-sm bg-black text-white p-2">
            슈프림 '30주년 기념 티셔츠 1994-2024' 출시
          </div>
        </div>
        <div className="news-item">
          <img
            src="path/to/image3.jpg"
            alt="News Image 3"
            className="w-full h-auto"
          />
          <div className="text-sm bg-black text-white p-2">
            루이 비통, 파페 VIA 바스티예 채널 디자인한 백주 공개
          </div>
        </div>
      </div>
      <button className="w-full text-align-center mt-4 py-2 px-6 bg-[#FF204E] text-white rounded">
        See More
      </button>
    </div>
  );
}

export default Home;
