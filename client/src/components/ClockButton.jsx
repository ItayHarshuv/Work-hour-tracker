import clsx from "clsx";
import { Play, Square } from "lucide-react";

export default function ClockButton({ active, onClick, disabled = false, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? "bg-rose-500 text-white hover:bg-rose-600"
          : "bg-emerald-500 text-white hover:bg-emerald-600",
        className
      )}
    >
      {active ? <Square size={16} /> : <Play size={16} />}
      {active ? "Clock Out" : "Clock In"}
    </button>
  );
}
