import EntryRow from "./EntryRow";

export default function EntryList({ entries, loading, onSaveComment, onDelete }) {
  if (loading) {
    return <p className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">Loading entries...</p>;
  }

  if (!entries.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
        No entries yet. Start by clocking in or adding a manual entry.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <EntryRow key={entry.id} entry={entry} onSaveComment={onSaveComment} onDelete={onDelete} />
      ))}
    </div>
  );
}
