import { Client, Storage } from "appwrite";

export function init_client(end_point: string): Client {
  const project_id = process.env.APPWRITE_PROJECT_ID;
  if (!project_id) {
    throw new Error("ID not provided");
  }
  const client = new Client().setEndpoint(end_point).setProject(project_id);
  return client;
}

export function init_storage(client: Client): Storage {
  const storage_ref = new Storage(client);
  return storage_ref;
}

export function get_file_preview(
  storage_ref: Storage,
  file_id: string
): string {
  let bucket_id = process.env.IMAGES_BUCKET_ID;
  if (!bucket_id) {
    throw new Error("Bucket ID not provided");
  }
  let image_src = storage_ref.getFilePreview(bucket_id, file_id).toString();
  return image_src;
}

export function get_image(image_id: string): string {
  const appwrite_end_point = process.env.APPWRITE_PUBLIC_END_POINT;
  if (!appwrite_end_point) {
    throw new Error("Bucket ID not provided");
  }
  const client = init_client(appwrite_end_point);
  const storage_ref = init_storage(client);
  return get_file_preview(storage_ref, image_id);
}
