import clsx from "clsx";
import { Trash2 } from "lucide-react";
import ClockButton from "./ClockButton";
import { formatDurationFromMinutes, formatHours } from "../lib/format";

export default function JobCard({
  job,
  isSelected,
  nowMs,
  onSelect,
  onClockToggle,
  onDelete,
  busy = false,
}) {
  const activeMinutes = job.activeEntry?.clockIn
    ? Math.max(0, Math.round((nowMs - new Date(job.activeEntry.clockIn).getTime()) / 60000))
    : 0;

  return (
    <article
      onClick={() => onSelect(job.id)}
      className={clsx(
        "cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-soft transition",
        "hover:border-slate-700",
        isSelected && "border-sky-400/70 ring-1 ring-sky-500/50"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: job.color }} />
            <h3 className="text-base font-semibold text-white">{job.name}</h3>
          </div>
          <p className="text-sm text-slate-400">Total: {formatHours(job.totalHours)}</p>
          {job.activeEntry && (
            <p className="text-xs text-emerald-300">Running: {formatDurationFromMinutes(activeMinutes)}</p>
          )}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(job.id);
          }}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-rose-300"
          aria-label={`Delete ${job.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <ClockButton
        active={Boolean(job.activeEntry)}
        onClick={(event) => {
          event.stopPropagation();
          onClockToggle(job);
        }}
        disabled={busy}
        className="w-full justify-center"
      />
    </article>
  );
}
