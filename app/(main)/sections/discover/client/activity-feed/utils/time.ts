import { useLocaleContext } from "@/lib/contexts/locale-context";

export function getRelativeTime(at: string) {
  const { t } = useLocaleContext();
  try {
    const date = new Date(at);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", at);
      return "알 수 없음";
    }

    const now = new Date();
    const diff = Math.max(0, now.getTime() - date.getTime());

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0)
      return `${t.common.time.daysAgo.replace("{{count}}", days.toString())}`;
    if (hours > 0)
      return `${t.common.time.hoursAgo.replace("{{count}}", hours.toString())}`;
    if (minutes > 0)
      return `${t.common.time.minutesAgo.replace(
        "{{count}}",
        minutes.toString()
      )}`;
    return t.common.time.now;
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "알 수 없음";
  }
}
