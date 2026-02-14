import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function formatHours(hours) {
  return `${Number(hours ?? 0).toFixed(2)}h`;
}

export function formatDateTime(value) {
  if (!value) return "-";
  return dayjs(value).format("MMM D, YYYY HH:mm");
}

export function formatDurationFromMinutes(minutes) {
  const safe = Math.max(0, minutes || 0);
  const d = dayjs.duration(safe, "minutes");
  const hh = String(Math.floor(d.asHours())).padStart(2, "0");
  const mm = String(d.minutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function toDatetimeLocalValue(value) {
  if (!value) return "";
  return dayjs(value).format("YYYY-MM-DDTHH:mm");
}
