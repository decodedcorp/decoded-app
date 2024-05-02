import { FirebaseHelper } from "@/common/firebase";
import { Article } from "@/types/model";
import { doc, getDocs, collection } from "firebase/firestore";
import Link from "next/link";

interface SectionProps {
  title: string;
  description?: string;
}

function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full text-black">
      <Section title="TAGGED daily" description="Happened daily" />
      <DailyCardNews />
      <Section title="NEWS" />
      <Card />
    </div>
  );
}

function Section({ title, description }: SectionProps) {
  return (
    <div className="flex flex-col border-b-2 border-gray-200 py-4 mb-6 items-center justify-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p> {description} </p>
    </div>
  );
}

async function DailyCardNews() {
  return (
    <div className="flex flex-col items-center w-96 mb-5">
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
  let newsList: Article[] = [];
  const db = FirebaseHelper.db();
  const querySnapshot = await getDocs(collection(db, "article"));
  querySnapshot.docs;
  querySnapshot.forEach((doc) => {
    const newsData = doc.data() as Article;
    if (newsData.url) {
      newsList.push(newsData);
    }
  });
  return (
    <div className="grid grid-cols-1 gap-5 w-1/2">
      {newsList?.map((news) => (
        <Link href={news.url} className="card card-side shadow-xl">
          <div className="card lg:card-side">
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
