import { FirebaseHelper } from "@/common/firebase";
import { News } from "@/types/model";
import { doc, getDocs, collection } from "firebase/firestore";
import Link from "next/link";

function Page() {
  return (
    <div className="m-10">
      <Card />
    </div>
  );
}

async function DailyCardNews() {
  return (
    <div className="flex flex-col items-center bg-red-500">
      <div className="carousel rounded-box">
        <div className="carousel-item w-full">
          <img
            src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
            className="w-full rounded-lg"
            alt="Tailwind CSS Carousel component"
          />
        </div>
        <div className="carousel-item w-full">
          <img
            src="https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
          />
        </div>
        <div className="carousel-item w-full">
          <img
            src="https://daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
          />
        </div>
        <div className="carousel-item w-full">
          <img
            src="https://daisyui.com/images/stock/photo-1494253109108-2e30c049369b.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
          />
        </div>
        <div className="carousel-item w-full">
          <img
            src="https://daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
          />
        </div>
        <div className="carousel-item w-full">
          <img
            src="https://daisyui.com/images/stock/photo-1559181567-c3190ca9959b.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
          />
        </div>
        <div className="carousel-item w-full">
          <img
            src="https://daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
          />
        </div>
      </div>
    </div>
  );
}

async function Card() {
  let newsList: News[] = [];
  const db = FirebaseHelper.db();
  const querySnapshot = await getDocs(collection(db, "article"));
  querySnapshot.docs;
  querySnapshot.forEach((doc) => {
    const newsData = doc.data() as News;
    if (newsData.url) {
      newsList.push(newsData);
    }
  });
  return (
    <div className="grid grid-cols-1 gap-5">
      {newsList?.map((news) => (
        <Link href={news.url} className="card card-side bg-base-100 shadow-xl">
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <figure>
              <img
                src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
                alt="Album"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{news.title}</h2>
              <p>{news.time}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Page;
