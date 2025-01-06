"use client";
import { Suspense } from "react";
import DetailPageContent from "./components/detail-page-content";
import LoadingView from "@/components/ui/loading";

export default function DetailPage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <DetailPageContent />
    </Suspense>
  );
}
