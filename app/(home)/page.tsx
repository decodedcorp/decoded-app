import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";
import { Storage } from "appwrite";
import { init_client, init_storage, get_file_preview } from "@/app/appwrite";
import AppContextProvider from "../../components/hooks/context";
import { FirebaseHelper } from "../../common/firebase";
import { listAll, getDownloadURL, getMetadata } from "firebase/storage";

const custom_font = localFont({ src: "../../fonts/utah-condensed-bold.ttf" });

const fetchAllImages = async (point: string) => {
  const storage_ref = FirebaseHelper.storage_ref(point);

  try {
    const res = await listAll(storage_ref);
    const urlAndHash = await Promise.all(
      res.items.map(async (itemRef) => {
        const [metadata, url] = await Promise.all([
          getMetadata(itemRef),
          getDownloadURL(itemRef),
        ]);
        // metadata.md5Hash가 undefined가 아닐 때만 객체를 반환합니다.
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
    console.log(error);
    return [];
  }
};

async function HomePage() {
  const urlsAndHashes = await fetchAllImages("images");
  console.log(urlsAndHashes);
  return (
    <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-[95%] w-full mx-auto">
      {urlsAndHashes?.map(({ url, hash }) => (
        <div key={hash} className="rounded-lg relative aspect-w-3 aspect-h-5">
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
      )) || <div>No images available</div>}
    </div>
  );
}

export default HomePage;
