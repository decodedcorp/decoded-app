import Image from "next/image";
import Link from "next/link";
import { FirebaseHelper } from "../../common/firebase";
import { listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { custom_font } from "@/components/helpers/util";

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

async function Home() {
  return (
    <div>
      <NewTaggedSection />
      <NewsSection />
      <SpotlightSection />
    </div>
  );
}

// async function HomePage() {
//   const urlsAndHashes = await fetchAllImages("images");
//   return (
//     <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-[95%] w-full mx-auto mt-10">
//       {urlsAndHashes?.map(({ url, hash }) => (
//         <div key={hash} className="rounded-lg relative aspect-w-3 aspect-h-5">
//           <Link
//             href={`images/${hash}?imageUrl=${encodeURIComponent(url)}`}
//             prefetch={false}
//           >
//             <Image
//               alt="LOADING"
//               className="w-full h-auto rounded-lg"
//               layout="fill"
//               src={url}
//               quality={80}
//               objectFit="cover"
//               placeholder="blur"
//               blurDataURL="data:image/jpeg;base64,..."
//               sizes="100vw"
//             />
//           </Link>
//         </div>
//       )) || (
//         <div>
//           <span className="loading loading-infinity loading-md"></span>
//         </div>
//       )}
//     </div>
//   );
// }

async function NewTaggedSection() {
  return (
    <div className="h-full rounded-md border-l-2 border-r-2 border-b-2 border-black p-3">
      <div className="flex justify-start items-stretch h-full">
        <div className="flex flex-col w-full h-full">
          <h1 className="text-2xl font-bold">Today's Pick</h1>
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

async function NewsSection() {
  return (
    <div className="rounded-md border-l-2 border-r-2 border-black p-3">
      <h1 className={`${custom_font.className} text-2xl font-bold mb-4`}>
        LAST NEWS
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
      <button className="w-full text-align-center mt-4 py-2 px-6 bg-red-700 text-white rounded">
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

export default Home;
