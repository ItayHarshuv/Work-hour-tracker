import { Clock3, PlusCircle } from "lucide-react";
import ClockButton from "./ClockButton";
import EntryList from "./EntryList";
import { formatHours } from "../lib/format";

export default function JobDetail({
  job,
  entries,
  entriesLoading,
  onClockToggle,
  onOpenManualEntry,
  onSaveComment,
  onDeleteEntry,
}) {
  if (!job) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center text-slate-400">
        Select a job from the left panel to see details and entries.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: job.color }} />
              <h2 className="text-xl font-bold text-white">{job.name}</h2>
            </div>
            <p className="text-sm text-slate-400">Total logged: {formatHours(job.totalHours)}</p>
          </div>
          <ClockButton active={Boolean(job.activeEntry)} onClick={() => onClockToggle(job)} />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenManualEntry}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            <PlusCircle size={16} />
            Add Manual Entry
          </button>
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300">
            <Clock3 size={15} />
            {job.activeEntry ? "Currently clocked in" : "Not clocked in"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Entries</h3>
        <EntryList entries={entries} loading={entriesLoading} onSaveComment={onSaveComment} onDelete={onDeleteEntry} />
      </div>
    </section>
  );
}
