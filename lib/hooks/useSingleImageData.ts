import { useState, useEffect } from 'react';
import { FirebaseHelper } from '@/common/firebase';
import { DetailPageState } from '@/types/model.d';
import { ImageInfo, BrandInfo, ArtistInfo, ArticleInfo } from '@/types/model.d';

export function useSingleImageData(imageId: string, isFeatured: boolean) {
  const [detailPageState, setDetailPageState] =
    useState<DetailPageState | null>(null);

  useEffect(() => {
    async function fetchImageData() {
      const imgDocId = decodeURIComponent(imageId);
      if (!(await FirebaseHelper.docExists('images', imgDocId))) return;

      const img = (
        await FirebaseHelper.doc('images', imgDocId)
      ).data() as ImageInfo;
      const itemList = (await FirebaseHelper.getHoverItems(imgDocId)).sort(
        (a, b) => {
          const topA = parseInt(a.pos.top || '0%');
          const topB = parseInt(b.pos.top || '0%');
          return topA !== topB
            ? topA - topB
            : parseInt(a.pos.left || '0%') - parseInt(b.pos.left || '0%');
        }
      );

      const normalizeBrand = (brand: string) => brand.toLowerCase().replace(/\s/g, '_');
      
      const brandList = Array.from(
        new Set(
          itemList.flatMap(item => (item.info.brands ?? []).map(normalizeBrand))
        )
      );

      const brandUrlList = new Map<string, string>();
      const brandLogo = new Map<string, string>();
      let artistList: string[] = [];
      let artistArticleList: ArticleInfo[] | undefined;
      let artistImgList: [string, string][] = [];

      if (img.tags?.brands) {
        const brandInfoList = await Promise.all(
          img.tags.brands.map(
            async (brandDocId) =>
              (
                await FirebaseHelper.doc('brands', brandDocId)
              ).data() as BrandInfo
          )
        );

        brandInfoList.forEach((brand) => {
          brandLogo.set(brand.name, brand.logoImageUrl ?? '');
          brandUrlList.set(
            brand.name.toLowerCase().replace(/\s/g, '_'),
            brand.sns?.['instagram'] ?? brand.websiteUrl ?? ''
          );
        });
      }

      if (img.tags?.artists && !isFeatured) {
        const artistInfoList = await Promise.all(
          img.tags.artists.map(
            async (artistDocId) =>
              (
                await FirebaseHelper.doc('artists', artistDocId)
              ).data() as ArtistInfo
          )
        );

        for (const artist of artistInfoList) {
          artistList.push(artist.name);

          if (artist.tags?.articles) {
            artistArticleList = await Promise.all(
              artist.tags.articles.map(
                async (articleDocId) =>
                  (
                    await FirebaseHelper.doc('articles', articleDocId)
                  ).data() as ArticleInfo
              )
            );
          }

          if (artist.tags?.images) {
            const images = await FirebaseHelper.listAllStorageItems('images');
            await Promise.all(
              images.items.map(async (image) => {
                const metadata = await FirebaseHelper.metadata(image);
                const docId = metadata?.customMetadata?.id;
                if (
                  docId &&
                  artist.tags?.images?.includes(docId) &&
                  docId !== imgDocId
                ) {
                  const imageUrl = await FirebaseHelper.downloadUrl(image);
                  artistImgList.push([docId, imageUrl]);
                }
              })
            );
          }
        }
      }

      setDetailPageState({
        img,
        itemList,
        brandUrlList,
        brandImgList: brandLogo,
        artistImgList,
        artistList,
        artistArticleList,
        colorInfo: img.colorInfo,
      });
    }

    fetchImageData();
  }, [imageId, isFeatured]);

  return detailPageState;
}
