import {
  ApiDetailPageState,
  DetailPageState,
  HoverItem,
} from '@/types/model.d';

function createDefaultMetadata() {
  return {
    name: null,
    description: null,
    brand: null,
    designed_by: null,
    material: null,
    color: null,
    item_class: '',
    item_sub_class: '',
    category: '',
    sub_category: '',
    product_type: '',
  };
}

function transformToHoverItem(
  item: any,
  docId: string,
  category: string
): HoverItem {
  return {
    imageDocId: docId,
    pos: item.position || { top: '0', left: '0' },
    info: {
      item: {
        item: {
          _id: item.item?.item?._id || '',
          metadata: item.item?.item?.metadata || createDefaultMetadata(),
          img_url: item.item?.item?.img_url || null,
        },
        brand_name: item.item?.brand_name || null,
        brand_logo_image_url: item.item?.brand_logo_image_url || null,
      },
    },
  };
}

function transformToImageItem(item: any, category: string) {
  return {
    position: item.position || { top: '0', left: '0' },
    identity: {
      id: item.item?.item?._id || '',
      name: item.item?.item?.metadata?.name || category,
      category: item.item?.item?.metadata?.category || '',
      profileImageUrl: item.item?.brand_logo_image_url || undefined,
    },
    category: {
      itemClass: item.item?.item?.metadata?.item_class || '',
      itemSubClass: item.item?.item?.metadata?.item_sub_class || '',
      category: item.item?.item?.metadata?.category,
      subCategory: item.item?.item?.metadata?.sub_category,
      productType: item.item?.item?.metadata?.product_type || '',
    },
  };
}

function collectBrandInfo(items: any[]) {
  const brandUrlList = new Map<string, string>();
  const brandImgList = new Map<string, string>();

  items.forEach((item) => {
    if (item.item?.brand_name && item.item?.brand_logo_image_url) {
      brandUrlList.set(item.item.brand_name, '#');
      brandImgList.set(item.item.brand_name, item.item.brand_logo_image_url);
    }
  });

  return { brandUrlList, brandImgList };
}

export function transformToDetailPageState(
  data: ApiDetailPageState
): DetailPageState {
  if (!data) {
    throw new Error('No data provided for transformation');
  }

  // Transform items
  const itemList: HoverItem[] = data.items
    ? Object.entries(data.items).flatMap(([category, items]) =>
        items.map((item) =>
          transformToHoverItem(item, data.doc_id || '', category)
        )
      )
    : [];

  // Collect brand information
  const { brandUrlList, brandImgList } = collectBrandInfo(
    data.items ? Object.values(data.items).flat() : []
  );

  // Transform items to Record<string, any[]>
  const transformedItems: Record<string, any[]> = {};
  if (data.items) {
    Object.entries(data.items).forEach(([category, items]) => {
      transformedItems[category] = items.map((item) => transformToImageItem(item, category));
    });
  }

  return {
    img: {
      title: data.title || '',
      description: data.description || '',
      imageUrl: data.img_url || '',
      updateAt: new Date(),
      hyped: data.like || 0,
      items: transformedItems,
    },
    itemList,
    brandUrlList,
    brandImgList,
    artistImgList: [],
    artistList: [],
    artistArticleList: [],
  };
}
