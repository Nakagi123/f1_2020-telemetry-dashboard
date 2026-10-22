import {
  CircleGauge,
  Gauge,
  Timer,
  Trophy,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0d1220] p-6 lg:block">
      <div className="mb-12 flex items-center gap-3">
        <div className="rounded-xl bg-red-600 p-3">
          <Gauge size={24} />
        </div>

        <div>
          <h1 className="font-black tracking-wide">
            F1 TELEMETRY
          </h1>
          <p className="text-xs text-slate-500">
            Race Engineering
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-red-600/15 px-4 py-3 font-semibold text-red-400">
          <CircleGauge size={20} />
          Live Dashboard
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500">
          <Timer size={20} />
          Lap Analysis
          <span className="ml-auto text-[10px]">
            SOON
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500">
          <Trophy size={20} />
          Session History
          <span className="ml-auto text-[10px]">
            SOON
          </span>
        </div>
      </nav>

      <div className="mt-16 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          System Status
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          UI Preview
        </div>
      </div>
    </aside>
  );
}