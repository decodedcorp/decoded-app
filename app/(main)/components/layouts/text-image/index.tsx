import Image from 'next/image';
import Link from 'next/link';
import { SpotlightInfo } from "@/types/model.d";
import { pretendardBold, pretendardRegular } from '@/lib/constants/fonts';

interface SpotlightLayoutProps {
    spotlight: SpotlightInfo;
  }
  
  export function SpotlightLayout({ spotlight }: SpotlightLayoutProps) {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <MainImage image={spotlight.images[0]} />
        <ContentSection spotlight={spotlight} />
      </div>
    );
  }
  
  interface MainImageProps {
    image: {
      id: string;
      imageUrl: string;
    };
  }
  
  function MainImage({ image }: MainImageProps) {
    return (
      <Link
        href={`/details?imageId=${image.id}&imageUrl=${encodeURIComponent(image.imageUrl)}`}
        className="w-full md:w-1/2 md:h-1/2"
      >
        <Image
          src={image.imageUrl}
          alt="Main spotlight image"
          width={800}
          height={800}
          className="object-cover w-full h-full"
        />
      </Link>
    );
  }
  
  interface ContentSectionProps {
    spotlight: SpotlightInfo;
  }
  
  function ContentSection({ spotlight }: ContentSectionProps) {
    return (
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h2 className={`${pretendardBold.className} text-2xl md:text-3xl mb-4`}>
            {spotlight.title}
          </h2>
          <p className="text-white/80 mb-6">{spotlight.description}</p>
          <ArtistInfo 
            profileImgUrl={spotlight.profileImgUrl}
            artist={spotlight.artist}
          />
        </div>
        <GallerySection 
          artist={spotlight.artist}
          images={spotlight.images.slice(1, 3)}
        />
      </div>
    );
  }
  
  interface ArtistInfoProps {
    profileImgUrl: string;
    artist: string;
  }
  
  function ArtistInfo({ profileImgUrl, artist }: ArtistInfoProps) {
    return (
      <div className="flex items-center mb-6">
        <Image
          src={profileImgUrl}
          alt={artist}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <span className={`${pretendardRegular.className}`}>{artist}</span>
      </div>
    );
  }
  
  interface GallerySectionProps {
    artist: string;
    images: Array<{
      id: string;
      imageUrl: string;
    }>;
  }
  
  function GallerySection({ artist, images }: GallerySectionProps) {
    return (
      <div className="flex flex-col w-full">
        <Link
          href={`/search?keyword=${artist}`}
          className={`${pretendardBold.className} text-right mt-4 text-white/80 hover:text-white mb-4`}
        >
          VIEW MORE +
        </Link>
        <div className="flex gap-4 w-full">
          {images.map((image, index) => (
            <Link
              key={index}
              href={`/details?imageId=${image.id}&imageUrl=${encodeURIComponent(image.imageUrl)}`}
              className="w-1/2 aspect-[3/4]"
            >
              <Image
                src={image.imageUrl}
                alt={`Spotlight image ${index + 2}`}
                width={300}
                height={400}
                className="object-cover w-full h-full"
              />
            </Link>
          ))}
        </div>
      </div>
    );
  }