import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{
    imageId: string;
    itemId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ItemPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { imageId } = resolvedParams;
  
  redirect(`/details/${imageId}`);
} 