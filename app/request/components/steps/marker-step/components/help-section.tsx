import { useLocaleContext } from "@/lib/contexts/locale-context";
import { HelpCircle } from "lucide-react";

export function HelpSection() {
  const { t } = useLocaleContext();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-zinc-800">
          <HelpCircle className="w-4 h-4 text-zinc-400" />
        </div>
        <h3 className="text-sm font-medium text-zinc-400">
          {t.request.steps.marker.guide.help.title}
        </h3>
      </div>
    </div>
  );
}
