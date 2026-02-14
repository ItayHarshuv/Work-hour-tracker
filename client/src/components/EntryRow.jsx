import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { formatDateTime, formatDurationFromMinutes, formatHours } from "../lib/format";

export default function EntryRow({ entry, onSaveComment, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(entry.comment ?? "");
  const isActive = entry.isActive;

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {entry.type === "manual" ? "Manual entry" : "Clock entry"}
            {isActive ? " - Active" : ""}
          </p>
          <p className="text-xs text-slate-400">Created {formatDateTime(entry.createdAt)}</p>
        </div>
        <div className="text-right text-sm text-slate-200">
          <p className="font-semibold">{formatHours(entry.durationHours)}</p>
          <p className="text-xs text-slate-400">{formatDurationFromMinutes(entry.durationMinutes)}</p>
        </div>
      </div>

      <div className="mb-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
        <p>Clock in: {formatDateTime(entry.clockIn)}</p>
        <p>Clock out: {formatDateTime(entry.clockOut)}</p>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={2}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setComment(entry.comment ?? "");
              }}
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-slate-500"
            >
              <X size={14} />
            </button>
            <button
              type="button"
              onClick={async () => {
                await onSaveComment(entry.id, comment);
                setEditing(false);
              }}
              className="rounded-lg bg-emerald-500 px-2 py-1 text-xs text-white transition hover:bg-emerald-600"
            >
              <Check size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-slate-300">{entry.comment || "No comment"}</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-rose-300"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
