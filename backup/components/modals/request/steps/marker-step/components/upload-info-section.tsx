import { useLocaleContext } from "@/lib/contexts/locale-context";
import { MousePointerClick } from "lucide-react";

export function InfoSection() {
  const { t } = useLocaleContext();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#EAFD66]/10">
          <MousePointerClick className="w-4 h-4 text-[#EAFD66]" />
        </div>
        <h3 className="text-sm font-medium text-white/80">
          {t.request.steps.marker.guide.required.title}
        </h3>
      </div>
      <div className="text-xs text-zinc-400 space-y-1.5">
        {t.request.steps.marker.guide.required.description.map(
          (desc, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-[#EAFD66]">•</span>
              <p>{desc}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
