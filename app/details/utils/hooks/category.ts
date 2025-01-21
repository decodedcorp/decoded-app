interface CategoryInfo {
  displayName: string;
  depth: number;
}

export function getCategoryInfo(metadata: any): CategoryInfo[] {
  const categories = [];
  
  // 기본 클래스 (Fashion)
  if (metadata?.item_class) {
    categories.push({
      displayName: metadata.item_class.toUpperCase(),
      depth: 1
    });
  }
  
  // 서브 클래스 (Clothing, Bags, etc)
  if (metadata?.item_sub_class) {
    categories.push({
      displayName: metadata.item_sub_class.toUpperCase(),
      depth: 2
    });
  }
  
  // 메인 카테고리 (Outerwear, Bottoms, etc)
  if (metadata?.category) {
    categories.push({
      displayName: metadata.category.toUpperCase(),
      depth: 3
    });
  } else if (metadata?.item_sub_class === 'bags') {
    // bags의 경우 category가 없을 때 item_sub_class를 사용
    categories.push({
      displayName: 'BAGS',
      depth: 3
    });
  }
  
  // 서브 카테고리 (Jackets, Pants, etc)
  if (metadata?.sub_category) {
    categories.push({
      displayName: metadata.sub_category.toUpperCase(),
      depth: 4
    });
  } else if (metadata?.product_type) {
    // sub_category가 없을 때 product_type을 사용
    categories.push({
      displayName: metadata.product_type.toUpperCase(),
      depth: 4
    });
  }

  return categories;
} 