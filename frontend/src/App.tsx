import {
  Activity,
  CircleGauge,
  CloudSun,
  Flag,
  Gauge,
  Radio,
  Thermometer,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";

const telemetry = {
  speed: 287,
  gear: 7,
  rpm: 11842,
  throttle: 94,
  brake: 12,
};

function TelemetryCard({
  label,
  value,
  unit,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: typeof Gauge;
}) {
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
          <span className="text-sm text-slate-400">{unit}</span>
        )}
      </div>
    </div>
  );
}

function PedalBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-3 flex justify-between">
        <span className="text-sm font-medium text-slate-300">
          {label}
        </span>
        <span className="font-bold tabular-nums text-white">
          {value}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-150`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
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

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 p-5 md:p-8">
          {/* HEADER */}
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

          {/* DRIVER + SESSION */}
          <section className="mb-6 grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <Flag size={16} className="text-red-500" />
                Current Driver
              </div>

              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-3xl font-black text-blue-400">
                  33
                </div>

                <div>
                  <h3 className="text-2xl font-black">
                    VERSTAPPEN
                  </h3>
                  <p className="mt-1 text-slate-400">
                    Red Bull Racing
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Driver #33
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <Activity size={16} className="text-red-500" />
                Session Information
              </div>

              <h3 className="text-2xl font-black">
                Spa-Francorchamps
              </h3>

              <p className="mt-1 text-slate-400">
                Race Session
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <CloudSun size={16} />
                  Clear
                </span>

                <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <Thermometer size={16} />
                  Track 28°C
                </span>

                <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <Thermometer size={16} />
                  Air 20°C
                </span>
              </div>
            </div>
          </section>

          {/* TELEMETRY CARDS */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <TelemetryCard
              label="Speed"
              value={telemetry.speed}
              unit="km/h"
              icon={Gauge}
            />

            <TelemetryCard
              label="Gear"
              value={telemetry.gear}
              icon={CircleGauge}
            />

            <TelemetryCard
              label="Engine RPM"
              value={telemetry.rpm.toLocaleString()}
              unit="rpm"
              icon={Zap}
            />
          </section>

          {/* PEDALS */}
          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-7 text-lg font-bold">
              Pedal Inputs
            </h3>

            <div className="grid gap-8 md:grid-cols-2">
              <PedalBar
                label="Throttle"
                value={telemetry.throttle}
                color="bg-emerald-500"
              />

              <PedalBar
                label="Brake"
                value={telemetry.brake}
                color="bg-red-500"
              />
            </div>
          </section>

          <footer className="mt-8 text-center text-xs text-slate-600">
            F1 Telemetry Dashboard · Built with React,
            TypeScript & Tailwind CSS
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;