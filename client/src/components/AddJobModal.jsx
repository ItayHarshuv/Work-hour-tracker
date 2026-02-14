import { useState } from "react";
import { X } from "lucide-react";

const presetColors = ["#3B82F6", "#14B8A6", "#22C55E", "#A855F7", "#F97316", "#EC4899"];

export default function AddJobModal({ open, onClose, onSubmit, loading = false }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(presetColors[0]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Create New Job</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit({ name, color });
            setName("");
            setColor(presetColors[0]);
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Job Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Website redesign"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-sky-400"
              required
            />
          </label>

          <div className="space-y-2">
            <span className="text-sm text-slate-300">Color</span>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`h-8 w-8 rounded-full border-2 ${item === color ? "border-white" : "border-transparent"}`}
                  style={{ backgroundColor: item }}
                />
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
