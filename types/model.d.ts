/**
 * The ImageInfo interface defines the structure for image information.
 * @param title The title of the image.
 * @param updateAt The date of the last update.
 * @param hyped The number of hyped.
 * @param taggedItem Optional array of tagged items.
 * @param tags Optional record of tags related to the image, with string keys and values.
 * @param description Optional description of the image.
 */
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
   * @example ["Jenni, "JenDeuk", "제니"]
   */
  also_known_as?: string[];
  /**
   * @example "Black Pink"
   */
  group?: string;
  /**
   * @example { "instagram": "https://www.instagram.com/jennie/", "twitter": "https://twitter.com/jennie" }
   */
  sns?: Record<string, string>;
  /**
   * @example { "brands": [${doc_id}], "images": ["${doc_id}"] }
   */
  tags?: Record<string, string[]>;
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
  /**
   * @example { "top": "100%", "left": "100%" }
   */
  pos: Position;
  /**
   * @example "ItemInfo {...}"
   */
  info: ItemInfo;
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
 * - tags: Tags
 */
export interface ItemInfo {
  /**
   * @example "Flared Cargo Pants"
   */
  name: string;
  /**
   * @example "Clothing"
   */
  category: string;
  /**
   */
  hyped: number;
  /**
   * @example "Demna Gvasalia"
   */
  designedBy?: string;
  /**
   * @example ["$100", "USD"]
   */
  price?: [string, string];
  /**
   * @example "https://example.com/?ref=123"
   */
  affiliateUrl?: string;
  /**
   * @example "https://example.com/image.jpg"
   */
  imageUrl?: string;
  /**
   * @example "Description for this item generated by LLM"
   */
  description?: string;
  /**
   * @example { "brands": [${doc_id}], "images": ["${doc_id}"] }
   */
  tags?: Record<string, string[]>;
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

export interface MainImageInfo {
  hyped: number;
  title?: string;
  tags?: string[];
  description?: string;
  itemInfoList?: ItemInfo[];
}

/**
 * The ArticleInfo interface defines the structure for article information.
 * @param title The title of the article.
 * @param src Optional array of source URLs for the article. Could be multiple sources if article is generated by LLM model
 * @param createdAt Optional creation date of the article.
 * @param imageUrl Optional URL of an image associated with the article.
 * @param summary Optional summary of the article.
 * @param tags Optional record of tags related to the article, with string keys and values.
 */
export interface ArticleInfo {
  title: string;
  src?: string | string[];
  createdAt?: string;
  imageUrl?: string;
  summary?: string;
  tags?: Record<string, string>;
}
