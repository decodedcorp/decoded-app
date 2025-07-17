import { useLocaleContext } from "@/lib/contexts/locale-context";

export function DetailLoading() {
  const { t } = useLocaleContext();
  return (
    <div className="h-24 flex items-center justify-center">
      <div className="text-sm text-neutral-400">{t.common.status.loading}</div>
    </div>
  );
}
