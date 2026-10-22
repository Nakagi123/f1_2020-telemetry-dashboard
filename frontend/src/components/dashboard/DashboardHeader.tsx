import { Radio } from "lucide-react";

import type { ConnectionStatus } from "../../hooks/useTelemetry";

interface DashboardHeaderProps {
  status: ConnectionStatus;
}

const statusStyles = {
  connected:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  connecting:
    "border-amber-500/30 bg-amber-500/10 text-amber-400",
  disconnected:
    "border-red-500/30 bg-red-500/10 text-red-400",
};

const statusLabels = {
  connected: "BACKEND CONNECTED",
  connecting: "CONNECTING...",
  disconnected: "DISCONNECTED",
};

export function DashboardHeader({
  status,
}: DashboardHeaderProps) {
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

      <div
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusStyles[status]}`}
      >
        <Radio size={16} />
        {statusLabels[status]}
      </div>
    </header>
  );
}