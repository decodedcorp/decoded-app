import { forwardRef } from "react";
import { cn } from "@/lib/utils/style";
import { ImageContainer, ImageContainerHandle } from "../../common/image-container";
import type { ImageContainerProps } from "../../types";

interface ImageContainerWrapperProps extends ImageContainerProps {
  isCroppingMode: boolean;
}

export const ImageContainerWrapper = forwardRef<ImageContainerHandle, ImageContainerWrapperProps>(
  ({ isCroppingMode, ...props }, ref) => {
    if (isCroppingMode) {
      return (
        <div
          className={cn(
            "w-full h-full",
            "flex items-center justify-center",
            "p-0",
            "overflow-hidden",
            "bg-[#1A1A1A]"
          )}
        >
          <ImageContainer {...props} ref={ref} />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "relative flex items-center justify-center",
          "h-full w-full p-0 mx-auto overflow-hidden",
          "bg-[#1A1A1A]"
        )}
      >
        <div
          className={cn(
            "relative aspect-[4/5] h-full max-h-[calc(100% - 10px)]",
            "flex items-center justify-center overflow-hidden"
          )}
        >
          <ImageContainer {...props} ref={ref} />
        </div>
      </div>
    );
  }
);

ImageContainerWrapper.displayName = "ImageContainerWrapper"; 