import { FirebaseHelper } from "@/common/firebase";
import { ArticleInfo } from "@/types/model";
import Image from "next/image";
import Link from "next/link";

interface SectionProps {
  title: string;
  description?: string;
}

function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full text-black">
      <Section title="TAGGED daily" description="Happened daily" />
      <Section title="NEWS" />
      <DailyCardNews />
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
          <Image
            src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
            className="w-full rounded-lg"
            alt="Tailwind CSS Carousel component"
            fill={true}
            objectFit="cover"
          />
        </div>
        <div className="carousel-item w-full">
          <Image
            src="https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
            fill={true}
            objectFit="cover"
          />
        </div>
        <div className="carousel-item w-full">
          <Image
            src="https://daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
            fill={true}
            objectFit="cover"
          />
        </div>
        <div className="carousel-item w-full">
          <Image
            src="https://daisyui.com/images/stock/photo-1494253109108-2e30c049369b.jpg"
            className="w-full"
            alt="Tailwind CSS Carousel component"
            fill={true}
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
}

async function Card() {
  let articleInfoList: ArticleInfo[] = [];
  const docs = await FirebaseHelper.docs("articles");
  docs.forEach((doc) => {
    const newsData = doc.data() as ArticleInfo;
    if (newsData.src) {
      articleInfoList.push(newsData);
    }
  });
  return (
    <div className="grid grid-cols-1 gap-5 w-1/2">
      {articleInfoList?.map((news, index) => (
        <Link
          key={index}
          href={news.src as string}
          className="card card-side shadow-xl"
        >
          <div className="card lg:card-side">
            <figure>
              <Image
                src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
                alt="Album"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{news.title}</h2>
              <p>{news.createdAt}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Page;
