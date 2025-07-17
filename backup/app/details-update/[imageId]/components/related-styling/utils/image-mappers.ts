import { RelatedImage } from '../types';

export const mapToRelatedImage = (image: any): RelatedImage => {
  if (!image) {
    return { image_doc_id: 'unknown', image_url: '' };
  }

  // 아티스트/트렌딩 이미지 형태
  if (image.image_doc_id && image.image_url) {
    return {
      image_doc_id: image.image_doc_id,
      image_url: image.image_url,
    };
  }

  // 브랜드 이미지 형태
  if (image._id && image.img_url) {
    return {
      image_doc_id: image._id,
      image_url: image.img_url,
    };
  }

  // 다양한 필드 조합을 처리
  return {
    image_doc_id: image._id || image.doc_id || image.image_doc_id || image.id || 'unknown',
    image_url: image.img_url || image.image_url || image.url || '',
  };
}; 