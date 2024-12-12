import Link from 'next/link';
import Image from 'next/image';
import { pretendardBold } from '@/lib/constants/fonts';

interface KeywordTagProps {
  name: string;
  imageUrl?: string;
}

export function KeywordTag({ name, imageUrl }: KeywordTagProps) {
  return (
    <Link
      href={`/search?keyword=${name}`}
      className={`flex w-fit p-2 md:p-4 bg-transparent rounded-full border 
        border-white/20 hover:bg-white/20 mt-2 md:mt-4 mr-2 md:mr-4`}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          width={20}
          height={20}
          className="rounded-full border border-white/20 mr-2"
        />
      )}
      <h3 className={`${pretendardBold.className} text-sm md:text-lg`}>
        {name.toUpperCase()}
      </h3>
    </Link>
  );
}

interface KeywordListProps {
  tags: Array<{
    name: string;
    imageUrl?: string;
  }>;
}

export function KeywordList({ tags }: KeywordListProps) {
  return (
    <div className="flex flex-wrap w-full md:w-[60vw] mt-6 md:mt-10">
      {tags?.map((tag, index) => (
        <KeywordTag 
          key={index}
          name={tag.name}
          imageUrl={tag.imageUrl}
        />
      ))}
    </div>
  );
}