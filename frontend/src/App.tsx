import {
  CircleGauge,
  Gauge,
  Zap,
} from "lucide-react";

import { Sidebar } from "./components/layout/Sidebar";
import { DashboardHeader } from "./components/dashboard/DashboardHeader";
import { DriverCard } from "./components/dashboard/DriverCard";
import { SessionCard } from "./components/dashboard/SessionCard";
import { TelemetryCard } from "./components/dashboard/TelemetryCard";
import { PedalBar } from "./components/dashboard/PedalBar";

import { useTelemetry } from "./hooks/useTelemetry";

function App() {
  const {
    telemetry,
    driver,
    session,
    status,
  } = useTelemetry();

  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 p-5 md:p-8">
          <DashboardHeader status={status} />

          {/* DRIVER + SESSION */}
          <section className="mb-6 grid gap-4 xl:grid-cols-2">
            {driver ? (
              <DriverCard driver={driver} />
            ) : (
              <div className="flex min-h-52 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-500">
                Waiting for driver information...
              </div>
            )}

            {session ? (
              <SessionCard session={session} />
            ) : (
              <div className="flex min-h-52 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-500">
                Waiting for session information...
              </div>
            )}
          </section>

          {/* TELEMETRY CARDS */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <TelemetryCard
              label="Speed"
              value={telemetry?.speed ?? "—"}
              unit="km/h"
              icon={Gauge}
            />

            <TelemetryCard
              label="Gear"
              value={
                telemetry
                  ? telemetry.gear === 0
                    ? "N"
                    : telemetry.gear === -1
                      ? "R"
                      : telemetry.gear
                  : "—"
              }
              icon={CircleGauge}
            />

            <TelemetryCard
              label="Engine RPM"
              value={
                telemetry
                  ? telemetry.rpm.toLocaleString()
                  : "—"
              }
              unit="rpm"
              icon={Zap}
            />
          </section>

          {/* PEDAL INPUTS */}
          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-7 text-lg font-bold">
              Pedal Inputs
            </h3>

            <div className="grid gap-8 md:grid-cols-2">
              <PedalBar
                label="Throttle"
                value={telemetry?.throttle ?? 0}
                color="bg-emerald-500"
              />

              <PedalBar
                label="Brake"
                value={telemetry?.brake ?? 0}
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