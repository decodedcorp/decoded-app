import Link from 'next/link';

const FEATURED_IMAGE = {
  id: 'cb5XDDVnqdOSG3Hem7gP',
  url: 'https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/featured%2Fnew_jeans_how_sweet_featured.webp?alt=media&token=581967a4-5790-40b7-9463-79f35ae2e4d7'
};

export function HeroContent() {
  const detailsUrl = `/details?imageId=${FEATURED_IMAGE.id}&imageUrl=${encodeURIComponent(FEATURED_IMAGE.url)}&isFeatured=yes`;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-center space-x-4 font-mono text-xl text-primary">
        <span>Decoding</span>
        <span>&</span>
        <span>Request</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground whitespace-pre-line text-center max-w-3xl">
        {'미디어속에 나온 제품을\n여기에서 찾아보세요'}
      </h1>
      <Link
        href={detailsUrl}
        className="inline-flex h-11 items-center justify-center rounded-none px-8 py-3 bg-primary font-mono font-bold text-black hover:bg-primary/90 transition-colors"
      >
        ITEM REQUEST
      </Link>
    </div>
  );
}
