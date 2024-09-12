import { MainImage } from "@/types/model";
import Link from "next/link";
import Image from "next/image";
import { bold_font, semi_bold_font } from "@/components/helpers/util";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Pin({ image }: { image: MainImage }) {
  return (
    <div className="flex flex-col w-full h-[600px] md:h-[800px] rounded-lg border border-white/10">
      <Link
        href={`images?imageId=${image.docId}&imageUrl=${encodeURIComponent(
          image.imageUrl
        )}`}
        className="w-full h-96 relative overflow-hidden aspect-w-3 aspect-h-4"
      >
        <Image
          src={image.imageUrl ?? ""}
          alt={image.title ?? ""}
          fill={true}
          style={{
            objectFit: "cover",
          }}
          className="rounded-lg"
        />
      </Link>
      <div className="flex flex-row justify-between items-center z-10 shadow-lg p-4">
        <div className={`${bold_font.className}`}>
          {image.artistInfoList?.map((artist, index) => {
            return (
              <div className="pb-1 justify-between" key={index}>
                <Link
                  href={`/artists?name=${artist.name}`}
                  className="flex flex-row items-center hover:underline"
                >
                  {/* <div className="rounded-xl w-5 h-5 bg-gray-400 mr-2"></div> */}
                  {artist.name.toUpperCase()}
                </Link>
              </div>
            );
          })}
        </div>
        <FavoriteBorderIcon className="w-4 h-4" />
      </div>
      <div
        className={`flex flex-col w-full ${bold_font.className} max-h-72 overflow-y-auto`}
      >
        {Array.from(image.itemInfoList.entries()).map(
          ([item, [pos, brand]], index) => {
            return (
              <Link
                href={item?.affiliateUrl ?? "#"}
                className="p-2 m-2 border-b border-white/10 flex flex-row"
                key={index}
              >
                <div className="w-16 h-20 relative border border-black rounded-lg">
                  <Image
                    src={item.imageUrl ?? ""}
                    alt={item.name}
                    fill={true}
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col ml-4 overflow-clip">
                  <div className="text-sm">
                    {brand[0]?.name.replace(/_/g, " ").toUpperCase()}
                  </div>
                  <div
                    className={`flex flex-row text-sm ${semi_bold_font.className} w-full justify-between`}
                  >
                    {item.name}
                  </div>
                </div>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}

export default Pin;
