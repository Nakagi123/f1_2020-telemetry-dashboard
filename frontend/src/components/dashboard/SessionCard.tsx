import {
  Activity,
  CloudSun,
  Thermometer,
} from "lucide-react";

import type { SessionInfo } from "../../types/telemetry";

interface SessionCardProps {
  session: SessionInfo;
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Activity size={16} className="text-red-500" />
        Session Information
      </div>

      <h3 className="text-2xl font-black">
        {session.trackName}
      </h3>

      <p className="mt-1 text-slate-400">
        {session.sessionName}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">
          <CloudSun size={16} />
          {session.weatherName}
        </span>

        <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">
          <Thermometer size={16} />
          Track {session.trackTemperature}°C
        </span>

        <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">
          <Thermometer size={16} />
          Air {session.airTemperature}°C
        </span>
      </div>
    </div>
  );
}