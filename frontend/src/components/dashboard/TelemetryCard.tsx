import type { LucideIcon } from "lucide-react";

interface TelemetryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
}

export function TelemetryCard({
  label,
  value,
  unit,
  icon: Icon,
}: TelemetryCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </span>

        <Icon size={20} className="text-red-500" />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tabular-nums text-white">
          {value}
        </span>

        {unit && (
          <span className="text-sm text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}