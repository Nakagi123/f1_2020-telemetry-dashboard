import { Flag } from "lucide-react";
import type { DriverInfo } from "../../types/telemetry";

interface DriverCardProps {
  driver: DriverInfo;
}

export function DriverCard({ driver }: DriverCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Flag size={16} className="text-red-500" />
        Current Driver
      </div>

      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-3xl font-black text-blue-400">
          {driver.raceNumber}
        </div>

        <div>
          <h3 className="text-2xl font-black">
            {driver.driverName}
          </h3>

          <p className="mt-1 text-slate-400">
            {driver.teamName}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Driver #{driver.raceNumber}
          </p>
        </div>
      </div>
    </div>
  );
}