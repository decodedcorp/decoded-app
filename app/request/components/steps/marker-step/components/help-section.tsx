import { useLocaleContext } from "@/lib/contexts/locale-context";

export function HelpSection() {
  const { t } = useLocaleContext();
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-full bg-gray-900 text-gray-400 flex items-center justify-center text-xs">
          ?
        </span>
        <h3 className="text-xs font-medium text-gray-400">
          {t.request.steps.marker.guide.help.title}
        </h3>
      </div>
      <div className="ml-7">
        <ul className="text-xs space-y-1 text-gray-500">
          <li>{t.request.steps.marker.guide.help.items[0]}</li>
          <li>{t.request.steps.marker.guide.help.items[1]}</li>
        </ul>
      </div>
    </div>
  );
}
