import { Radio } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
          Race Control
        </p>

        <h2 className="text-3xl font-black md:text-4xl">
          Live Dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Real-time Formula 1 telemetry monitoring
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">
        <Radio size={16} />
        DEMO MODE
      </div>
    </header>
  );
}