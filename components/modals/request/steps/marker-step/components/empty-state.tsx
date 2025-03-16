import { MarkerHeader } from "./marker-header";
import { useLocaleContext } from "@/lib/contexts/locale-context";

export function EmptyState() {
  const { t } = useLocaleContext();
  return (
    <div className="flex flex-col h-full">
      <MarkerHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-xs text-gray-500 text-center">
          {t.request.steps.marker.marker.list.title}
        </p>
      </div>
    </div>
  );
}
