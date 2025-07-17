import { useLocaleContext } from "@/lib/contexts/locale-context";

export function MarkerHeader() {
  const { t } = useLocaleContext();
  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-800">
      <h3 className="text-xs font-medium text-gray-400">
        {t.request.steps.marker.title}
      </h3>
    </div>
  );
}
