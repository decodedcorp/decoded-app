import { useLocaleContext } from "@/lib/contexts/locale-context";

export function InfoSection() {
  const { t } = useLocaleContext();
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-xs">
          !
        </span>
        <h3 className="text-xs font-medium text-gray-400">
          {t.common.validation.required}
        </h3>
      </div>
      <div className="ml-7">
        <p className="text-xs text-gray-500">
          {t.request.steps.marker.guide.required.description[0]}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {t.request.steps.marker.guide.required.description[1]}
        </p>
      </div>
    </div>
  );
}
