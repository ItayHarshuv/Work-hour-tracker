export const MINUTES_PER_HOUR = 60;

export function getDurationMinutes(entry) {
  if (typeof entry.manualMinutes === "number") {
    return entry.manualMinutes;
  }

  if (entry.clockIn && entry.clockOut) {
    const ms = new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime();
    return Math.max(0, Math.round(ms / 60000));
  }

  return 0;
}

export function minutesToHours(minutes) {
  return Number((minutes / MINUTES_PER_HOUR).toFixed(2));
}
