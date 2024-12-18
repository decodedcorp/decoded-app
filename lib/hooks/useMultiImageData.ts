import { useState, useEffect } from 'react';
import { FirebaseHelper } from '@/common/firebase';
import { ImageInfo, FeaturedInfo, ArtistInfo, ArticleInfo } from '@/types/model.d';

interface MultiImageData {
  title: string | null;
  description: string | null;
  featuredImgs: {
    imageUrl: string;
    imgInfo: ImageInfo;
    imageDocId: string;
  }[] | null;
  artistArticleList: ArticleInfo[] | undefined;
  artistImgList: [string, string][];
}

export function useMultiImageData(imageId: string) {
  const [data, setData] = useState<MultiImageData>({
    title: null,
    description: null,
    featuredImgs: null,
    artistArticleList: undefined,
    artistImgList: [],
  });

  useEffect(() => {
    async function fetchFeaturedImage() {
      const imgDocId = decodeURIComponent(imageId);
      if (!(await FirebaseHelper.docExists('featured', imgDocId))) return;

      const img = (await FirebaseHelper.doc('featured', imgDocId)).data() as FeaturedInfo;
      let artistArticleList: ArticleInfo[] | undefined;
      let artistImgList: [string, string][] = [];
      let filter: string[] = [];

      const featuredImgs = await Promise.all(
        img.images.map(async (imageDocId) => {
          filter.push(imageDocId);
          const imgRef = await FirebaseHelper.doc('images', imageDocId);
          const imgInfo = imgRef.data() as ImageInfo;
          const ref = FirebaseHelper.storageRef(`images/${imageDocId}`);
          const url = await FirebaseHelper.downloadUrl(ref);

          if (imgInfo.tags?.artists) {
            const artistInfoList = await Promise.all(
              imgInfo.tags.artists.map(async (artistDocId) => 
                (await FirebaseHelper.doc('artists', artistDocId)).data() as ArtistInfo
              )
            );

            for (const artist of artistInfoList) {
              if (artist.tags?.articles) {
                artistArticleList = await Promise.all(
                  artist.tags.articles.map(async (articleDocId) =>
                    (await FirebaseHelper.doc('articles', articleDocId)).data() as ArticleInfo
                  )
                );
              }

              if (artist.tags?.images) {
                const images = await FirebaseHelper.listAllStorageItems('images');
                await Promise.all(
                  images.items.map(async (image) => {
                    const metadata = await FirebaseHelper.metadata(image);
                    const docId = metadata?.customMetadata?.id;
                    if (docId && artist.tags?.images?.includes(docId) && docId !== imgDocId) {
                      const imageUrl = await FirebaseHelper.downloadUrl(image);
                      if (!artistImgList.some(([id]) => id === docId)) {
                        artistImgList.push([docId, imageUrl]);
                      }
                    }
                  })
                );
              }
            }
          }

          return { imageUrl: url, imageDocId, imgInfo };
        })
      );

      setData({
        title: img.title,
        description: img.description,
        featuredImgs,
        artistArticleList,
        artistImgList: artistImgList.filter(([id]) => !filter.includes(id)),
      });
    }

    fetchFeaturedImage();
  }, [imageId]);

  return data;
} 