import { FloatingBox } from '../floating-box';

interface ImageInfo {
  doc_id: string;
  img_url: string | null;
  title: string | null;
  style: string | null;
  position?: {
    top: string;
    left: string;
  };
  item?: {
    item: {
      _id: string;
      metadata: {
        name: string | null;
        description: string | null;
        brand: string | null;
        designed_by: string | null;
        material: string | null;
        color: string | null;
        item_class: string;
        item_sub_class: string;
        category: string;
        sub_category: string;
        product_type: string;
      };
      img_url: string | null;
      requester: string;
      requested_at: string;
      link_info: any;
      like: number;
    };
    brand_name: string | null;
    brand_logo_image_url: string | null;
  };
}

interface BoxPositionProps {
  top: number;
  left?: number;
  right?: number;
  isLarge?: boolean;
  image?: ImageInfo;
  onHover?: (isHovered: boolean, event?: React.MouseEvent, isLarge?: boolean) => void;
}

export function BoxPosition({
  top,
  left,
  right,
  isLarge,
  image,
  onHover,
}: BoxPositionProps) {
  return (
    <div
      className="absolute"
      style={{
        top: `${top}%`,
        ...(left !== undefined ? { left: `${left}%` } : {}),
        ...(right !== undefined ? { right: `${right}%` } : {}),
      }}
    >
      <FloatingBox
        isLarge={isLarge}
        image={image}
        onHover={(isHovered, event) => onHover?.(isHovered, event, isLarge)}
      />
    </div>
  );
} 