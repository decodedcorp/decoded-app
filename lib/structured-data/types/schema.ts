interface Thing {
  "@type": string;
  "@id"?: string;
  name?: string;
  description?: string;
  url?: string;
}

export interface ProductSchema extends Thing {
  "@type": "Product";
  brand?: BrandSchema;
  image?: string | ImageSchema;
  isRelatedTo?: string;
}

export interface BrandSchema extends Thing {
  "@type": "Brand";
  logo?: string;
}

export interface ImageSchema extends Thing {
  "@type": "ImageObject";
  contentUrl?: string;
  datePublished?: string;
  author?: PersonSchema;
  width?: number;
  height?: number;
  caption?: string;
}

// User, Identity
export interface PersonSchema extends Thing {
  "@type": "Person";
  additionalName?: string;
  gender?: string;
  jobTitle?: string;
  image?: string | ImageSchema;
  url?: string;
}

export interface WebsiteSchema extends Thing {
  "@context": string;
  "@type": "WebSite";
  url?: string;
  name?: string;
  description?: string;
  potentialAction?: {
    "@type": string;
    target: string;
    "query-input": string;
  };
}
