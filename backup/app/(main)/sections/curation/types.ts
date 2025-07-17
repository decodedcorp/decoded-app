export interface CurationContent {
  _id: string;
  content_type: "main_page";
  curation_type: "identity" | "brand" | "context";
  contents: {
    title: string;
    sub_title: string;
    description: string;
    sub_image_url: string;
    docs: Array<{
      image_doc_id: string;
      image_url: string;
      items: Array<{
        top: string;
        left: string;
      }>;
    }>;
  };
  created_at: string;
  updated_at: string;
}
