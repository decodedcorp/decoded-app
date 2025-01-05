/**
 * The ImageInfo interface defines the structure for image information.
 * @param title The title of the image.
 * @param updateAt The date of the last update.
 * @param hyped The number of hyped.
 * @param taggedItem Optional array of tagged items.
 * @param tags Optional record of tags related to the image, with string keys and values.
 * @param description Optional description of the image.
 * @param extractedColors Optional array of extracted colors.
 */

// types/model.d.ts
export interface ImagePosition {
  left: string;
  top: string;
}

export interface RequestedItem {
  position: {
    top: string;
    left: string;
  };
  imageId: string;
  originalPosition: {
    top: string;
    left: string;
  };
}

export interface ImageRequest {
  title: string;
  description: string;
  style: string;
  imgUrl: string;
  requestedItems: RequestedItem[];
}

export interface ImageDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  items: {
    position: ImagePosition;
    identity: {
      id: string;
      name: string;
      category: string;
      profileImageUrl?: string;
    };
    category: {
      itemClass: string;
      itemSubClass: string;
      category?: string;
      subCategory?: string;
      productType: string;
    };
  }[];
}

export interface ImageInfo {
  /**
   * @example "New York Fashion Week 2024"
   */
  title: string;
  /**
   * @example "2024-03-01"
   */
  updateAt: Date;
  /**
   * @example 100
   */
  hyped: number;
  /**
   * @example "https://example.com/image.jpg"
   */
  mainImageUrl?: string;
  /**
   * @example ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
   */
  subImageUrls?: string[];
  /**
   * @example "grunge", "minimalist",
   */
  style?: string;
  /**
   * @example TaggedItem { "id": "123", "pos": { "top": "100px", "left": "100px" } }
   */
  taggedItem?: TaggedItem[] | HoverItem[];
  /**
   * @example { "brands": [${doc_id}], "images": ["${doc_id}"] }
   */
  tags?: Record<string, string[]>;
  /**
   * @example "Description for the image"
   */
  description?: string;
  /**
   * @example { "background": ["#FFFFFF", "#000000"], "style": ["#FFFFFF", "#000000"] }
   */
  colorInfo?: ColorInfo;
  /**
   * @example "Source url"
   */
  source?: string;
  imageUrl: string;
  items?: {
    position: Position;
    identity: {
      id: string;
      name: string;
      category: string;
      profileImageUrl?: string;
    };
    category: {
      itemClass: string;
      itemSubClass: string;
      category?: string;
      subCategory?: string;
      productType: string;
    };
  }[];
}

/**
 * The ArtistInfo interface defines the structure for artist information.
 * @param name The name of the artist.
 * @param category The category of the artist.
 * @param also_known_as Optional array of other names the artist is known by.
 * @param group Optional group the artist belongs to.
 * @param sns Optional record of social media links, with string keys and values.
 * @param tags Optional record of tags related to the artist, with string keys and values.
 */
export interface ArtistInfo {
  /**
   * Rule: Name should be in English.
   * @example "Jennie"
   */
  name: string;
  /**
   * @example "photographer"
   */
  category: string[];
  /**
   * @example "https://example.com/image.jpg"
   */
  profileImgUrl?: string;
  /**
   * @example ["Jenni", "JenDeuk", "제니"]
   */
  also_known_as?: string[];
  /**
   * @example "{kr:블랙핑크, en:Black Pink}"
   */
  group?: Record<string, string>;
  /**
   * @example { "instagram": "https://www.instagram.com/jennie/", "twitter": "https://twitter.com/jennie" }
   */
  sns?: Record<string, string>;
  /**
   * @example { "brands": [${doc_id}], "images": ["${doc_id}"] }
   */
  tags?: Record<string, string[]>;
  /**
   * @example "https://example.com/image.jpg"
   */
}

export interface GroupInfo {
  name: string;
  /**
   * @example { "instagram": "https://www.instagram.com/blackpinkofficial/", "twitter": "https://twitter.com/blackpink" }
   */
  sns?: Record<string, string>;
  /**
   * @example { "artists": [${doc_id}] }
   */
  tags?: Record<string, string[]>;
}

/**
 * The TaggedItem interface defines the structure for tagged item information.
 * @param id The id of the tagged item.
 * @param pos The position of the tagged item.
 */
export interface TaggedItem {
  /**
   * @example "ItemInfo ${doc_id}"
   */
  id: string;
  /**
   * @example { "top": "100%", "left": "100%" }
   */
  pos: Position;
}

/**
 * The HoverItem interface defines the structure for hover item information.
 * @param pos The position of the hover item.
 * @param info The information of the hover item of type `ItemInfo`
 */
export interface HoverItem {
  pos: Position;
  info: {
    item: {
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
      };
      brand_name: string | null;
      brand_logo_image_url: string | null;
    };
  };
}

/**
 * The Position interface defines where `HoverItem` is located.
 * @param top The top position of the item.
 * @param left The left position of the item.
 */
export interface Position {
  /**
   * @example "100%"
   */
  top?: string;
  /**
   * @example "100%"
   */
  left?: string;
}

/**
 *
 * Interface for `ItemInfo`
 *
 * Fields
 * - name: Name of the item
 * - category: Name of the category if any
 * - hyped: Number of hyped(e.g Number of clicks)
 * - designedBy: Name of designer if any
 * - price: [price, currency]
 * - affiliateUrl: Affiliate URL
 * - imageUrl: Image URL
 * - season: Season
 * - runway_url: Runway URL
 * - tags: Tags
 */
export interface ItemInfo {
  identity: {
    id: string;
    name: string;
    category: string;
    profileImageUrl?: string;
  };
  category: string;
}

export interface BrandInfo {
  name: string;
  category: string;
  creativeDirector?: string[];
  websiteUrl?: string;
  logoImageUrl?: string;
  sns?: Record<string, string>;
  tags?: Record<string, string[]>;
}

export interface MainImage {
  imageUrl: string;
  docId: string;
  title?: string;
  tags?: string[];
  description?: string;
  itemInfoList: Map<ItemInfo, [Position, BrandInfo[]]>;
  artistInfoList?: ArtistInfo[];
}

/**
 * The ArticleInfo interface defines the structure for article information.
 * @param title The title of the article.
 * @param src Optional array of source URLs for the article. Could be multiple sources if article is generated by LLM model
 * @param createdAt Optional creation date of the article.
 * @param imageUrl Optional URL of an image associated with the article.
 * @param summary Optional summary of the article.
 * @param source Optional source of the article.
 * @param tags Optional record of tags related to the article, with string keys and values.
 */
export interface ArticleInfo {
  title: string;
  source?: string;
  src?: string | string[];
  createdAt?: string;
  imageUrl?: string;
  summary?: string;
  tags?: Record<string, string>;
}

/**
 * Interface for uploading items
 */
interface HoverItemInfo {
  isNew: boolean;
  pos: Position;
  info: ItemInfo;
  /**
   * @example Raw artist name if it is new
   */
  artistName?: string;
  /**
   * @example Raw brand names
   */
  brandName?: string[];
  /**
   * @example Type would be `File` if it is new
   */
  hoverItemImg?: File;
}

interface ColorInfo {
  /**
   * @example ["#FFFFFF", "#000000"]
   */
  background?: string;
  /**
   * @example ["#FFFFFF", "#000000"]
   */
  style?: string[];
}

interface FeaturedInfo {
  docId: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  images: string[];
}

interface DetailPageState {
  /**
   * Image info
   */
  img?: ImageInfo;
  /**
   * Hover items
   */
  itemList?: HoverItem[];
  /**
   * Brand names
   */
  brandUrlList?: Map<string, string>;
  /**
   * Brand image list
   */
  brandImgList?: Map<string, string>;
  /**
   * Artist names
   */
  artistList?: string[];
  /**
   * [docId, imageUrl]
   */
  artistImgList?: [string, string][];
  /**
   * Artist articles
   */
  artistArticleList?: ArticleInfo[];
  /**
   * Artist items
   */
  artistItemList?: ItemInfo[];
  /**
   * Extracted color info from image
   */
  colorInfo?: ColorInfo;
}

interface ArtistPageState {
  artist?: ArtistInfo;
  brandList?: string[];
  brandImgList?: Map<string, string>;
  /**
   * [docId, imageUrl]
   */
  artistImgList?: [string, string][];
  artistArticleList?: ArticleInfo[];
  /**
   * [docId, imageUrl]
   */
  artistProfileImgUrl?: string;
}

export interface PickInfo {
  imageUrl: string;
  title: string;
  description: string;
  artist: string;
  items: {
    pos: Position;
    imageUrl: string;
    name: string;
    affilateUrl: string;
    brand: {
      logoUrl: string;
      name: string;
    };
  }[];
}

export interface SpotlightInfo {
  images: {
    id: string;
    imageUrl: string;
  }[];
  title: string;
  description: string;
  artist: string;
  profileImgUrl: string;
}

export interface TrendingNowInfo {
  name: string;
  imageUrl: string;
}

export interface DiscoverInfo {
  section: string;
  items: {
    name: string;
    imageUrl: string;
    brand: string;
  }[];
}

export interface LinkInfo {
  url: string;
  label?: string;
}

export interface LinkInfoWithProvider {
  provider: string;
  value: string;
  label: string;
}

export interface ItemMetadata {
  name?: string;
  category?: string;
  description?: string;
}

export interface ItemData {
  imgUrl?: string;
  metadata?: ItemMetadata;
}

export interface Item extends ItemData {
  Id: string;
  requester: string;
  requestedAt: string;
  like: number;
}

export interface HoverItem extends ItemData {
  imageDocId: string;
  metadata?: ItemMetadata;
  imgUrl?: string;
}

export interface ItemDocument {
  Id: string;
  requester: string;
  requestedAt: string;
  imgUrl?: string;
  like: number;
  metadata?: ItemMetadata;
}

export interface ProvideData {
  links: string[];
  provider?: string;
}

export interface ProvideInfo<T> {
  who: string;
  value: T;
  provideStatus: ProvideStatus;
}

export interface ProvideItemInfo {
  brand?: string;
  links?: ProvideInfo<string>[];
}

export interface ProvidedItemDetail {
  itemDocId: string;
  position: Position;
  provideItemInfo: ProvideItemInfo;
}

export enum ProvideStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Point {
  x: number;
  y: number;
  context?: string;
}

export interface RequestImage {
  requestedItems: RequestedItem[];
  requestBy: string;
  imageFile?: string;
  metadata: Record<string, string>;
}

export interface ApiDetailPageState {
  title: string | null;
  description: string;
  like: number;
  style: string | null;
  img_url: string;
  source: string | null;
  upload_by: string;
  doc_id: string;
  decoded_percent: number;
  items: {
    [key: string]: {
      is_decoded: boolean;
      position: {
        top: string;
        left: string;
      };
      item: {
        item: {
          _id: string;
          requester: string;
          requested_at: string;
          link_info: any;
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
          like: number;
        };
        brand_name: string | null;
        brand_logo_image_url: string | null;
      };
    }[];
  };
}

// Base interfaces
export interface Position {
  top?: string;
  left?: string;
}

export interface Point {
  x: number;
  y: number;
  context?: string;
}

export interface LinkInfo {
  url: string;
  label?: string;
}

export interface LinkInfoWithProvider {
  provider: string;
  value: string;
  label: string;
}

// Identity related interfaces
export interface IdentityInfo {
  name: Record<string, string>;
  category: string;
  profileImageUrl?: string;
  linkInfo?: LinkInfo[];
}

export interface IdentityDocument {
  id: string;
  name: Record<string, string>;
  category: string;
  profileImageUrl: string;
}

// Brand related interfaces
export interface BrandInfo {
  name: Record<string, string>;
  logoImageUrl?: string;
  linkInfo?: LinkInfo[];
}

export interface BrandData {
  en: string;
  ko: string;
  docId: string;
  logoImageUrl: string;
}

// Item related interfaces
export interface ItemMetadata {
  name?: string;
  description?: string;
  brand?: string;
  designedBy?: string;
  material?: string;
  color?: string;
  itemClass?: string;
  itemSubClass?: string;
  category?: string;
  subCategory?: string;
  productType?: string;
}

export interface ItemDocument {
  Id: string;
  requester: string;
  requestedAt: string;
  linkInfo?: LinkInfoWithProvider[];
  metadata: ItemMetadata;
  imgUrl: string;
  like: number;
}

export interface ItemDocumentWithBrandInfo {
  item: ItemDocument;
  brandName: string;
  brandLogoImageUrl: string;
}

export interface Item {
  category: string;
  isDecoded: boolean;
  item: ItemDocumentWithBrandInfo;
  position: Position;
}

// Request related interfaces
export interface RequestedItem {
  itemClass?: string;
  itemSubClass?: string;
  category?: string;
  subCategory?: string;
  productType?: string;
  position: Position;
  context?: string;
}

export interface RequestImage {
  requestedItems: RequestedItem[];
  requestBy: string;
  imageFile: string;
  metadata: Record<string, string>;
}

// Image related interfaces
export interface ImageDocument {
  docId: string;
  decodedNum: number;
  description: string;
  imgUrl: string;
  items: Record<string, Item[]>;
  like: number;
  source?: string;
  style: string[];
  title: string;
  uploadBy: string;
}

// Category related interfaces
export interface Category<T = Category> {
  name: string;
  children?: T[];
  is_leaf: boolean;
  instances?: string[];
}

export interface CategoryDoc {
  item_class: string;
  depth: number;
  inner?: Category[];
}

// Provide related interfaces
export interface ProvideData {
  provider?: string;
  links?: string[];
}

export interface ProvideInfo<T> {
  who: string;
  value: T;
  provideStatus: ProvideStatus;
}

export interface ProvideItemInfo {
  brand?: string;
  links?: ProvideInfo<string>[];
}

export interface ProvidedItemDetail {
  itemDocId: string;
  position: Position;
  provideItemInfo: ProvideItemInfo;
}

export interface HasFields {
  hasImage?: boolean;
  hasBrand?: boolean;
  hasName?: boolean;
  hasMaterial?: boolean;
  hasDesignedBy?: boolean;
  hasColor?: boolean;
  hasDescription?: boolean;
}

export interface AdditionalMetadata {
  name?: string;
  material?: string;
  designedBy?: string;
  color?: string;
  brand?: string;
  description?: string;
}

export interface ConfirmItemInfo {
  base64Image?: string;
  approveUrls?: LinkInfo[];
  rejectUrls?: string[];
  additionalMetadata?: AdditionalMetadata;
}

export interface ProvideItemInfoWithMetadata {
  itemDocId: string;
  hasFields: HasFields;
  unconfirmedLinks?: string[];
}

export interface ItemRequest {
  imageDocId: string | null;
  imageUrl: string | null;
  isRequested: boolean;
  items: ProvidedItemDetail[] | null;
}

export enum ProvideStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

interface ItemInfo {
  url: string;
  affiliateUrl?: string;
}
