// General schema from Schema.org
interface GeneralSchema {
  "@context": "https://schema.org";
}
interface Thing extends GeneralSchema {
  "@type": string;
  "@id"?: string;
  name?: string;
  description?: string;
}

// Schema for our item
export interface ItemSchema extends Thing {
  "@type": "Product";
  // Brand of the item
  brand?: BrandSchema;
  // Item image
  image?: string | ImageSchema;
  // Related links
  isRelatedTo?: ItemSchema | ServiceSchema;
  // Related links
  sameAs?: UrlSchema[];
  // Related artist
  about?: PersonSchema;
  // Item category. ">" represents hierarchical category
  category?: string;
}

export interface ServiceSchema extends Thing {
  "@type": "Service";
  // link label
  category?: string;
  // link url
  url?: string;
}

export interface UrlSchema extends Thing {
  "@type": "URL";
  url: string;
  category?: string;
}

export interface BrandSchema extends Thing {
  "@type": "Brand";
  name?: string;
  logo?: string;
}

export interface ImageSchema extends Thing {
  "@type": "ImageObject";
  contentUrl?: string;
  datePublished?: string;
  width?: number;
  height?: number;
  caption?: string;
  about?: PersonSchema;
  brand?: BrandSchema;
}

// User, Identity
export interface PersonSchema extends Thing {
  "@type": "Person";
  "@id"?: string;
  name?: string;
  additionalName?: string;
  gender?: string;
  jobTitle?: string;
  image?: string | ImageSchema;
  url?: string;
}

export interface WebsiteSchema extends Thing {
  "@type": "WebSite";
  url?: string;
  name?: string;
  description?: string;
}
