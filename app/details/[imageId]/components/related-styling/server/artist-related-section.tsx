import { ProcessedImageData } from '@/lib/api/types/image';

export default function ArtistRelatedSection(data: ProcessedImageData) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {/* {data?.items?.map((item) => (
          <div
            key={item.item_doc_id}
            className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden"
          >
            <Image
              src={image.image_url}
              alt="Related styling image"
              width={300}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        ))} */}
      </div>
    </>
  );
}
