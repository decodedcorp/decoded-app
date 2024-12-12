function PinView({ images }: { images: MainImage[] | null }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  
    const getCols = () => {
      if (isMobile) return 2;
      if (isTablet) return 4;
      return 6;
    };
  
    return (
      <div className="flex flex-col w-full mt-20">
        <h2
          className={`flex ${bold_font.className} mb-10 justify-center text-xl md:text-4xl`}
        >
          스타일 둘러보기
        </h2>
        <ImageList
          variant="masonry"
          cols={getCols()}
          gap={20}
          className="p-2 mt-10"
        >
          <div>
            {images?.map((image, index) => (
              <ImageListItem key={index}>
                <Pin image={image} />
              </ImageListItem>
            ))}
          </div>
        </ImageList>
      </div>
    );
  }