"use client";

import { useSearchParams, notFound } from "next/navigation";

function Page() {
  const searchParams = useSearchParams();
  const encode = searchParams.get("name") ?? "";
  if (!encode) {
    notFound();
  }
  const artistName = decodeURIComponent(encode);
  return <div>THIS IS ARTIST PAGE {artistName}</div>;
}

export default Page;
