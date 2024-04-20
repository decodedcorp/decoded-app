import Image from "next/image";
import Link from "next/link";
import { FirebaseHelper } from "../../common/firebase";
import { listAll, getDownloadURL, getMetadata } from "firebase/storage";

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

async function HomePage() {
  const urlsAndHashes = await fetchAllImages("images");
  return (
    <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-[95%] w-full mx-auto mt-10">
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
      )) || (
        <div>
          <span className="loading loading-infinity loading-md"></span>
        </div>
      )}
    </div>
  );
}

export default HomePage;
