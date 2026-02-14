import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { X } from "lucide-react";

const modeButtons = [
  { id: "hours", label: "By hours" },
  { id: "range", label: "By clock-in/out" },
];

export default function AddManualEntryModal({ open, onClose, onSubmit, loading = false }) {
  const [mode, setMode] = useState("hours");
  const [manualHours, setManualHours] = useState("1");
  const [clockIn, setClockIn] = useState(dayjs().hour(9).minute(0).second(0).millisecond(0).format("YYYY-MM-DDTHH:mm"));
  const [clockOut, setClockOut] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
  const [comment, setComment] = useState("");

  const payload = useMemo(() => {
    if (mode === "hours") {
      return {
        manualHours: Number(manualHours),
        comment: comment.trim(),
      };
    }

    return {
      clockIn: dayjs(clockIn).toISOString(),
      clockOut: dayjs(clockOut).toISOString(),
      comment: comment.trim(),
    };
  }, [mode, manualHours, clockIn, clockOut, comment]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add Manual Entry</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 flex rounded-xl bg-slate-800 p-1">
          {modeButtons.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`w-1/2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                mode === item.id ? "bg-slate-700 text-white" : "text-slate-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(payload);
            setComment("");
            setManualHours("1");
          }}
        >
          {mode === "hours" ? (
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Hours</span>
              <input
                type="number"
                min="0.25"
                step="0.25"
                value={manualHours}
                onChange={(event) => setManualHours(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-sky-400"
                required
              />
            </label>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Clock In</span>
                <input
                  type="datetime-local"
                  value={clockIn}
                  onChange={(event) => setClockIn(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-sky-400"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-300">Clock Out</span>
                <input
                  type="datetime-local"
                  value={clockOut}
                  onChange={(event) => setClockOut(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-sky-400"
                  required
                />
              </label>
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Comment</span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="Worked on bug fixes and QA"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-sky-400"
            />
          </label>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
